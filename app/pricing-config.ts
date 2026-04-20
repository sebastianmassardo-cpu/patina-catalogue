import type { CollectionPricingRule, PriceRule, PricingRow, Product } from './catalogue-types'
import { getProductGlassType } from './catalogue-display'

type PricingLookupInput = Pick<Product, 'price_key'>

export type PricingLookup = Record<string, PricingRow>
export type PricingSummaryEntry = {
  id: string
  collectionLabel: string
  glassTypeLabel: string
}

export type PricingSummaryGroup = {
  id: string
  label: string
  price_1: number | null
  price_2: number | null
  price_4: number | null
  collectionLabels: string[]
  entries: PricingSummaryEntry[]
  priceKeys: string[]
}

export function normalizePricingToken(value: string | null | undefined) {
  const normalized = value
    ?.trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return normalized || null
}

function normalizePricingKey(value: string | null | undefined) {
  return normalizePricingToken(value)
}

function getMostRecentPricingRows(pricingRows: PricingRow[]) {
  return Array.from(
    pricingRows.reduce<Map<string, PricingRow>>((lookup, pricingRow) => {
      const pricingKey = normalizePricingKey(pricingRow.price_key)

      if (!pricingKey) {
        return lookup
      }

      const currentRow = lookup.get(pricingKey)

      if (!currentRow) {
        lookup.set(pricingKey, pricingRow)
        return lookup
      }

      const currentTimestamp = currentRow.created_at ? Date.parse(currentRow.created_at) : 0
      const nextTimestamp = pricingRow.created_at ? Date.parse(pricingRow.created_at) : 0

      if (nextTimestamp >= currentTimestamp) {
        lookup.set(pricingKey, pricingRow)
      }

      return lookup
    }, new Map())
  ).map(([, pricingRow]) => pricingRow)
}

export function buildPricingLookup(pricingRows: PricingRow[]) {
  return getMostRecentPricingRows(pricingRows).reduce<PricingLookup>((lookup, pricingRow) => {
    const pricingKey = normalizePricingKey(pricingRow.price_key)

    if (!pricingKey) {
      return lookup
    }

    lookup[pricingKey] = pricingRow
    return lookup
  }, {})
}

export function resolveProductPriceKey(product: PricingLookupInput) {
  return normalizePricingKey(product.price_key)
}

export function isPackOnlyProduct(product: PricingLookupInput) {
  return Boolean(resolveProductPriceKey(product)?.startsWith('p4_'))
}

export function getProductPricing(product: PricingLookupInput, pricingByKey: PricingLookup) {
  const pricingKey = resolveProductPriceKey(product)

  if (!pricingKey) {
    return null
  }

  return pricingByKey[pricingKey] ?? null
}

function getPriceKeyTail(priceKey: string) {
  return priceKey.startsWith('copa_') ? priceKey.slice(5) : priceKey
}

function resolveGlassKey(priceKey: string, glassKeys: string[]) {
  const tail = getPriceKeyTail(priceKey)

  return glassKeys
    .sort((left, right) => right.length - left.length)
    .find((glassKey) => tail === glassKey || tail.startsWith(`${glassKey}_`))
}

function resolvePriceKeySuffix(priceKey: string, glassKey: string) {
  const tail = getPriceKeyTail(priceKey)

  if (tail === glassKey) {
    return null
  }

  return tail.startsWith(`${glassKey}_`) ? tail.slice(glassKey.length + 1) : null
}

export function buildPricingRowsFromRules(
  products: Product[],
  priceRules: PriceRule[],
  collectionPricingRules: CollectionPricingRule[]
): PricingRow[] {
  const pricesByGlassAndDesign = priceRules.reduce<Record<string, PriceRule>>(
    (lookup, priceRule) => {
      const glassKey = normalizePricingToken(priceRule.glass_key)
      const designKey = normalizePricingToken(priceRule.design_key)

      if (glassKey && designKey) {
        lookup[`${glassKey}:${designKey}`] = priceRule
      }

      return lookup
    },
    {}
  )
  const designByCollection = collectionPricingRules.reduce<Record<string, string>>(
    (lookup, collectionPricingRule) => {
      const collectionKey = normalizePricingToken(collectionPricingRule.collection_key)
      const designKey = normalizePricingToken(collectionPricingRule.design_key)

      if (collectionKey && designKey) {
        lookup[collectionKey] = designKey
      }

      return lookup
    },
    {}
  )
  const glassKeys = Array.from(
    new Set(
      priceRules
        .map((priceRule) => normalizePricingToken(priceRule.glass_key))
        .filter((glassKey): glassKey is string => Boolean(glassKey))
    )
  )
  const pricingRowsByKey = products.reduce<Map<string, PricingRow>>((lookup, product) => {
    const priceKey = resolveProductPriceKey(product)

    if (!priceKey || isPackOnlyProduct(product)) {
      return lookup
    }

    const glassKey = resolveGlassKey(priceKey, glassKeys)

    if (!glassKey) {
      return lookup
    }

    const collectionKey = normalizePricingToken(product.collection)
    const suffixKey = resolvePriceKeySuffix(priceKey, glassKey)
    const designKey =
      (collectionKey ? designByCollection[collectionKey] : null) ??
      (suffixKey ? designByCollection[suffixKey] : null) ??
      (suffixKey === 'pers' || collectionKey?.startsWith('personalizado')
        ? 'personalizado'
        : null)

    if (!designKey) {
      return lookup
    }

    const priceRule = pricesByGlassAndDesign[`${glassKey}:${designKey}`]

    if (!priceRule) {
      return lookup
    }

    lookup.set(priceKey, {
      id: priceRule.id ?? `${priceKey}:${glassKey}:${designKey}`,
      price_key: priceKey,
      price_1: priceRule.price_1,
      price_2: priceRule.price_2,
      price_4: priceRule.price_4,
      created_at: priceRule.updated_at ?? priceRule.created_at ?? null,
    })

    return lookup
  }, new Map())

  return Array.from(pricingRowsByKey.values())
}

export function formatClpPrice(value: number) {
  return `$${value.toLocaleString('es-CL')}`
}

function createPricingTupleKey(pricingRow: Pick<PricingRow, 'price_1' | 'price_2' | 'price_4'>) {
  return [pricingRow.price_1 ?? 'na', pricingRow.price_2 ?? 'na', pricingRow.price_4 ?? 'na'].join(
    ':'
  )
}

function formatPriceKeyFallback(priceKey: string) {
  return priceKey
    .replace(/^p4_/, '')
    .split('_')
    .filter(Boolean)
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1))
    .join(' ')
}

function formatCollectionFallback(priceKey: string) {
  const collectionToken = priceKey
    .replace(/^p4_/, '')
    .split('_')
    .filter(Boolean)
    .at(-1)

  if (!collectionToken) {
    return formatPriceKeyFallback(priceKey)
  }

  return collectionToken.charAt(0).toUpperCase() + collectionToken.slice(1)
}

function formatGlassTypeFallback(priceKey: string) {
  const glassType = getProductGlassType({ price_key: priceKey })

  if (glassType) {
    return `Copa ${glassType.label.toLocaleLowerCase('es')}`
  }

  return 'Copa'
}

function createPricingSummaryEntryId(collectionLabel: string, glassTypeLabel: string) {
  return [normalizePricingToken(collectionLabel), normalizePricingToken(glassTypeLabel)]
    .filter(Boolean)
    .join(':')
}

function comparePricingSummaryEntries(
  left: PricingSummaryEntry,
  right: PricingSummaryEntry
) {
  return (
    left.collectionLabel.localeCompare(right.collectionLabel, 'es', { sensitivity: 'base' }) ||
    left.glassTypeLabel.localeCompare(right.glassTypeLabel, 'es', { sensitivity: 'base' })
  )
}

function toRomanNumeral(value: number) {
  const numerals = [
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' },
  ]

  let remaining = value
  let result = ''

  for (const numeral of numerals) {
    while (remaining >= numeral.value) {
      result += numeral.symbol
      remaining -= numeral.value
    }
  }

  return result
}

function compareNullableNumbers(a: number | null, b: number | null) {
  if (a === b) {
    return 0
  }

  if (a === null) {
    return 1
  }

  if (b === null) {
    return -1
  }

  return a - b
}

export function buildPricingSummaryGroups(
  pricingRows: PricingRow[],
  products: Product[]
): PricingSummaryGroup[] {
  const activePricingRows = getMostRecentPricingRows(pricingRows)
  const summaryEntriesByKey = products.reduce<Record<string, Map<string, PricingSummaryEntry>>>(
    (lookup, product) => {
      const pricingKey = resolveProductPriceKey(product)
      const collectionLabel = product.collection?.trim() || null

      if (!pricingKey || isPackOnlyProduct(product)) {
        return lookup
      }

      const fallbackCollectionLabel = formatCollectionFallback(pricingKey)
      const glassType = getProductGlassType(product)
      const entry: PricingSummaryEntry = {
        collectionLabel: collectionLabel || fallbackCollectionLabel,
        glassTypeLabel: glassType
          ? `Copa ${glassType.label.toLocaleLowerCase('es')}`
          : formatGlassTypeFallback(pricingKey),
        id: '',
      }

      entry.id = createPricingSummaryEntryId(entry.collectionLabel, entry.glassTypeLabel)
      lookup[pricingKey] ??= new Map<string, PricingSummaryEntry>()
      lookup[pricingKey].set(entry.id, entry)
      return lookup
    },
    {}
  )

  const groups = activePricingRows.reduce<
    Map<
      string,
      {
        id: string
        price_1: number | null
        price_2: number | null
        price_4: number | null
        collectionLabels: Set<string>
        entries: Map<string, PricingSummaryEntry>
        priceKeys: Set<string>
      }
    >
  >((lookup, pricingRow) => {
    const pricingKey = normalizePricingKey(pricingRow.price_key)

    if (!pricingKey || pricingKey.startsWith('p4_')) {
      return lookup
    }

    const groupId = createPricingTupleKey(pricingRow)
    const group =
      lookup.get(groupId) ??
      {
        id: groupId,
        price_1: pricingRow.price_1,
        price_2: pricingRow.price_2,
        price_4: pricingRow.price_4,
        collectionLabels: new Set<string>(),
        entries: new Map<string, PricingSummaryEntry>(),
        priceKeys: new Set<string>(),
      }

    const summaryEntries = summaryEntriesByKey[pricingKey]

    if (summaryEntries?.size) {
      summaryEntries.forEach((entry) => {
        group.collectionLabels.add(entry.collectionLabel)
        group.entries.set(entry.id, entry)
      })
    } else {
      const entry: PricingSummaryEntry = {
        collectionLabel: formatCollectionFallback(pricingKey),
        glassTypeLabel: formatGlassTypeFallback(pricingKey),
        id: '',
      }

      entry.id = createPricingSummaryEntryId(entry.collectionLabel, entry.glassTypeLabel)
      group.collectionLabels.add(entry.collectionLabel)
      group.entries.set(entry.id, entry)
    }

    group.priceKeys.add(pricingKey)
    lookup.set(groupId, group)
    return lookup
  }, new Map())

  return Array.from(groups.values())
    .sort((left, right) => {
      return (
        compareNullableNumbers(left.price_1, right.price_1) ||
        compareNullableNumbers(left.price_2, right.price_2) ||
        compareNullableNumbers(left.price_4, right.price_4)
      )
    })
    .map((group, index) => ({
      id: group.id,
      label: `Serie ${toRomanNumeral(index + 1)}`,
      price_1: group.price_1,
      price_2: group.price_2,
      price_4: group.price_4,
      collectionLabels: Array.from(group.collectionLabels).sort((left, right) =>
        left.localeCompare(right, 'es')
      ),
      entries: Array.from(group.entries.values()).sort(comparePricingSummaryEntries),
      priceKeys: Array.from(group.priceKeys).sort((left, right) =>
        left.localeCompare(right, 'es')
      ),
    }))
}

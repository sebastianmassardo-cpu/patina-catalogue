import type { PricingRow, Product } from './catalogue-types'

type PricingLookupInput = Pick<Product, 'price_key'>

export type PricingLookup = Record<string, PricingRow>
export type PricingSummaryGroup = {
  id: string
  label: string
  price_1: number | null
  price_2: number | null
  price_4: number | null
  collectionLabels: string[]
  priceKeys: string[]
}

function normalizePricingKey(value: string | null | undefined) {
  const normalized = value?.trim().toLowerCase()
  return normalized || null
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
  const collectionLabelsByKey = products.reduce<Record<string, string>>((lookup, product) => {
    const pricingKey = resolveProductPriceKey(product)
    const collectionLabel = product.collection?.trim()

    if (!pricingKey || isPackOnlyProduct(product)) {
      return lookup
    }

    lookup[pricingKey] = collectionLabel || formatCollectionFallback(pricingKey)
    return lookup
  }, {})

  const groups = activePricingRows.reduce<
    Map<
      string,
      {
        id: string
        price_1: number | null
        price_2: number | null
        price_4: number | null
        collectionLabels: Set<string>
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
        priceKeys: new Set<string>(),
      }

    group.collectionLabels.add(
      collectionLabelsByKey[pricingKey] ?? formatCollectionFallback(pricingKey)
    )
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
      priceKeys: Array.from(group.priceKeys).sort((left, right) =>
        left.localeCompare(right, 'es')
      ),
    }))
}

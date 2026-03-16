import type { Product } from './catalogue-types'

export type ProductPricing = {
  unit: number
  pack2: number
  pack4: number
}

type PricingLookupInput = Pick<Product, 'name' | 'slug' | 'price_key' | 'price_clp'>

const PRICING_BY_UNIT_PRICE: Record<number, ProductPricing> = {
  12990: { unit: 12990, pack2: 24990, pack4: 44990 },
  13990: { unit: 13990, pack2: 26990, pack4: 47990 },
  14990: { unit: 14990, pack2: 27990, pack4: 49990 },
  16990: { unit: 16990, pack2: 31990, pack4: 55990 },
}

export const PRODUCT_PRICING_MAP: Record<string, ProductPricing> = {
  copa_coctail_mascotas: { unit: 14990, pack2: 27990, pack4: 49990 },
  copa_coctail_frutal: { unit: 14990, pack2: 27990, pack4: 49990 },
  copa_coctail_floral: { unit: 14990, pack2: 27990, pack4: 49990 },
  copa_coctail_marina: { unit: 14990, pack2: 27990, pack4: 49990 },
  copa_coctail_salvia: { unit: 14990, pack2: 27990, pack4: 49990 },
  copa_coctail_plumario: { unit: 16990, pack2: 31990, pack4: 55990 },
  copa_coctail_pers: { unit: 16990, pack2: 31990, pack4: 55990 },
  copa_balon_mascotas: { unit: 14990, pack2: 27990, pack4: 49990 },
  copa_balon_frutal: { unit: 14990, pack2: 27990, pack4: 49990 },
  copa_balon_floral: { unit: 14990, pack2: 27990, pack4: 49990 },
  copa_balon_marina: { unit: 14990, pack2: 27990, pack4: 49990 },
  copa_balon_salvia: { unit: 14990, pack2: 27990, pack4: 49990 },
  copa_balon_plumario: { unit: 16990, pack2: 31990, pack4: 55990 },
  copa_balon_pers: { unit: 16990, pack2: 31990, pack4: 55990 },
  copa_espumante: { unit: 12990, pack2: 24990, pack4: 44990 },
  copa_espumante_pers: { unit: 13990, pack2: 26990, pack4: 47990 },
  copa_espumante_cristal_pers: { unit: 14990, pack2: 27990, pack4: 49990 },
}

function normalizePricingToken(value: string | null | undefined) {
  if (!value) {
    return null
  }

  const normalized = value
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')

  return normalized || null
}

function getPricingCandidates(product: PricingLookupInput) {
  return [product.price_key, product.slug, product.name]
    .map(normalizePricingToken)
    .filter((candidate): candidate is string => Boolean(candidate))
}

function stripPackPrefix(candidate: string) {
  return candidate.startsWith('p4_') ? candidate.slice(3) : candidate
}

export function isPackOnlyProduct(product: PricingLookupInput) {
  return getPricingCandidates(product).some((candidate) => {
    if (!candidate.startsWith('p4_')) {
      return false
    }

    return stripPackPrefix(candidate) in PRODUCT_PRICING_MAP
  })
}

export function resolvePricingKey(product: PricingLookupInput) {
  const candidates = getPricingCandidates(product)

  for (const candidate of candidates) {
    if (candidate in PRODUCT_PRICING_MAP) {
      return candidate
    }

    const baseCandidate = stripPackPrefix(candidate)

    if (baseCandidate in PRODUCT_PRICING_MAP) {
      return baseCandidate
    }
  }

  return null
}

export function getProductPricing(product: PricingLookupInput) {
  const pricingKey = resolvePricingKey(product)

  if (pricingKey) {
    return PRODUCT_PRICING_MAP[pricingKey]
  }

  return PRICING_BY_UNIT_PRICE[product.price_clp] ?? null
}

export function formatClpPrice(value: number) {
  return `$${value.toLocaleString('es-CL')}`
}

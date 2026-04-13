import type { Product } from './catalogue-types'

export type GlassTypeOption = {
  id: string
  label: string
  displayLabel: string
  aliases: string[]
}

export const GLASS_TYPE_OPTIONS: GlassTypeOption[] = [
  {
    id: 'espumante_cristal',
    label: 'Espumante cristal',
    displayLabel: 'Copa tipo espumante cristal',
    aliases: ['espumante cristal'],
  },
  {
    id: 'espumante',
    label: 'Espumante',
    displayLabel: 'Copa tipo espumante',
    aliases: ['espumante'],
  },
  {
    id: 'coctel',
    label: 'Cóctel',
    displayLabel: 'Copa tipo cóctel',
    aliases: ['coctel', 'cóctel'],
  },
  {
    id: 'balon',
    label: 'Balón',
    displayLabel: 'Copa tipo balón',
    aliases: ['balon', 'balón'],
  },
  {
    id: 'vino',
    label: 'Vino',
    displayLabel: 'Copa tipo vino',
    aliases: ['vino'],
  },
]

export function formatCollectionLabel(collection: string | null | undefined) {
  const normalized = collection?.trim()

  if (!normalized) {
    return 'Colección'
  }

  return normalized
}

function normalizeDisplayToken(value: string | null | undefined) {
  const normalized = value
    ?.trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return normalized || null
}

function getPriceKeyTail(priceKey: string) {
  return priceKey.startsWith('copa_') ? priceKey.slice(5) : priceKey
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function toFlexibleSpacePattern(value: string) {
  return escapeRegExp(value).replace(/\s+/g, '\\s+')
}

function capitalizeFirst(value: string) {
  return value.charAt(0).toLocaleUpperCase('es') + value.slice(1)
}

export function getProductGlassType(product: Pick<Product, 'price_key'>) {
  const priceKey = normalizeDisplayToken(product.price_key)

  if (!priceKey) {
    return null
  }

  const tail = getPriceKeyTail(priceKey)

  return (
    GLASS_TYPE_OPTIONS.find(
      (glassType) => tail === glassType.id || tail.startsWith(`${glassType.id}_`)
    ) ?? null
  )
}

function removeGlassTypeFromDescription(description: string, glassType: GlassTypeOption) {
  const typePattern = glassType.aliases.map(toFlexibleSpacePattern).join('|')
  const leadingPattern = new RegExp(
    `^\\s*(?:tipo\\s+(?:de\\s+)?)?(?:copa\\s+(?:de\\s+)?)?(?:${typePattern})(?:\\s*[.,;:|/·•\\-–—]+\\s*|\\s+|$)`,
    'iu'
  )
  const trailingPattern = new RegExp(
    `(?:\\s*[.,;:|/·•\\-–—]+\\s*|\\s+)(?:tipo\\s+(?:de\\s+)?)?(?:copa\\s+(?:de\\s+)?)?(?:${typePattern})\\s*$`,
    'iu'
  )
  let cleaned = description.trim()
  const before = cleaned

  cleaned = cleaned.replace(leadingPattern, '').replace(trailingPattern, '')

  if (cleaned !== before) {
    cleaned = cleaned.replace(/^(?:con|de|del|para|en)\s+/i, '')
  }

  cleaned = cleaned
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .replace(/(?:\s*[.,;:|/·•\-–—]+\s*|\s+)copa\s*$/iu, '')
    .replace(/^[.,;:|/·•\-–—]+\s*/, '')
    .replace(/\s*[.,;:|/·•\-–—]+$/, '')
    .trim()

  return cleaned ? capitalizeFirst(cleaned) : ''
}

export function formatProductDescription(product: Pick<Product, 'description' | 'price_key'>) {
  const description = product.description?.trim()

  if (!description) {
    return 'Copa única pintada a mano.'
  }

  const glassType = getProductGlassType(product)
  const cleanedDescription = glassType
    ? removeGlassTypeFromDescription(description, glassType)
    : description

  return cleanedDescription || 'Copa única pintada a mano.'
}

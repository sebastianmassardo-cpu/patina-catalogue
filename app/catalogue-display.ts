const COLLECTION_LABEL_ALIASES: Record<string, string> = {
  'personalizado copa': 'Personalizada',
  'personalizado espumante cristal': 'Espumante cristal',
  'personalizado espumate': 'Espumante',
}

export function formatCollectionLabel(collection: string | null | undefined) {
  const normalized = collection?.trim()

  if (!normalized) {
    return 'Colección'
  }

  return COLLECTION_LABEL_ALIASES[normalized.toLowerCase()] ?? normalized
}

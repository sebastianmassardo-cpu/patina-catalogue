export function formatCollectionLabel(collection: string | null | undefined) {
  const normalized = collection?.trim()

  if (!normalized) {
    return 'Colección'
  }

  return normalized
}

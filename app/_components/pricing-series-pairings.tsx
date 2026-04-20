import { formatCollectionLabel } from '../catalogue-display'
import type { PricingSummaryEntry } from '../pricing-config'

type PricingSeriesPairingsProps = {
  compact?: boolean
  entries: PricingSummaryEntry[]
}

function groupEntriesByCollection(entries: PricingSummaryEntry[]) {
  return Array.from(
    entries.reduce<Map<string, { collectionLabel: string; glassTypeLabels: Set<string> }>>(
      (lookup, entry) => {
        const collectionKey = entry.collectionLabel.toLocaleLowerCase('es')
        const group =
          lookup.get(collectionKey) ??
          {
            collectionLabel: entry.collectionLabel,
            glassTypeLabels: new Set<string>(),
          }

        group.glassTypeLabels.add(entry.glassTypeLabel)
        lookup.set(collectionKey, group)
        return lookup
      },
      new Map()
    )
  )
    .map(([, group]) => ({
      collectionLabel: group.collectionLabel,
      glassTypeLabels: Array.from(group.glassTypeLabels).sort((left, right) =>
        left.localeCompare(right, 'es', { sensitivity: 'base' })
      ),
    }))
    .sort((left, right) =>
      left.collectionLabel.localeCompare(right.collectionLabel, 'es', { sensitivity: 'base' })
    )
}

export function PricingSeriesPairings({
  compact = false,
  entries,
}: PricingSeriesPairingsProps) {
  if (!entries.length) {
    return null
  }

  const groupedEntries = groupEntriesByCollection(entries)

  return (
    <div className={compact ? 'mt-4' : 'mt-5'}>
      <p className="text-[8px] uppercase tracking-[0.28em] text-[#8E9791]">
        Colección + copa
      </p>

      <div
        className={`mt-3 overflow-hidden rounded-[1.15rem] border border-[#E9E0D8] bg-[linear-gradient(180deg,rgba(255,255,255,0.44),rgba(249,246,242,0.2))] shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] ${
          compact ? 'text-[10px]' : 'text-[10.5px]'
        }`}
      >
        {groupedEntries.map((entryGroup) => (
          <div
            key={entryGroup.collectionLabel}
            className={`grid gap-2 border-b border-[#EFE6DE]/80 px-3.5 py-3 last:border-b-0 ${
              compact
                ? 'sm:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]'
                : 'sm:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)]'
            }`}
          >
            <p
              className={`font-serif leading-snug tracking-[-0.02em] text-[#30463B] ${
                compact ? 'text-[0.95rem]' : 'text-[1.02rem]'
              }`}
            >
              {formatCollectionLabel(entryGroup.collectionLabel)}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {entryGroup.glassTypeLabels.map((glassTypeLabel) => (
                <span
                  key={glassTypeLabel}
                  className="rounded-full border border-[#DBD2C9] bg-[#F9F6F2]/72 px-2.5 py-1 text-[9.5px] leading-none tracking-[0.02em] text-[#506058]"
                >
                  {glassTypeLabel}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

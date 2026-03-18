import { formatClpPrice, type PricingSummaryGroup } from '../pricing-config'

type PricingSummaryProps = {
  groups: PricingSummaryGroup[]
}

const PRICE_LABELS = [
  { key: 'price_1', label: '1 copa' },
  { key: 'price_2', label: '2 copas' },
  { key: 'price_4', label: '4 copas' },
] as const

export function PricingSummary({ groups }: PricingSummaryProps) {
  if (!groups.length) {
    return null
  }

  return (
    <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 md:px-10 md:pb-24 md:pt-10">
      <div className="relative overflow-hidden rounded-[2.4rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(247,244,240,0.97))] px-6 py-8 shadow-[0_24px_60px_rgba(22,63,44,0.05)] md:px-8 md:py-10">
        <div className="absolute left-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-[#E8DED6]/45 blur-3xl" />
        <div className="absolute right-[-2rem] top-8 h-32 w-32 rounded-full bg-[#DCE5DE]/40 blur-3xl" />

        <div className="relative">
          <div className="grid gap-5 border-b border-[#E8DED6] pb-7 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#7A857E]">
                Precios por formato
              </p>
              <h2 className="mt-3 max-w-xl font-serif text-[1.6rem] leading-[1.12] tracking-[-0.03em] text-[#163F2C] md:text-[2.02rem]">
                Colecciones combinables por grupo de precio.
              </h2>
            </div>

          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            {groups.map((group) => {
              const priceRows = PRICE_LABELS.reduce<
                Array<{
                  key: (typeof PRICE_LABELS)[number]['key']
                  label: (typeof PRICE_LABELS)[number]['label']
                  value: number
                }>
              >((rows, priceLabel) => {
                const value = group[priceLabel.key]

                if (value === null) {
                  return rows
                }

                rows.push({
                  key: priceLabel.key,
                  label: priceLabel.label,
                  value,
                })

                return rows
              }, [])

              return (
                <article
                  key={group.id}
                  className="rounded-[1.9rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.42),rgba(255,255,255,0.18))] px-5 py-5 ring-1 ring-[#ECE2D9]/70 backdrop-blur-[1px] md:px-6 md:py-6"
                >
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.28em] text-[#8D9690]">
                      Grupo de precio
                    </p>
                    <h3 className="mt-2 font-serif text-[1.34rem] leading-none tracking-[-0.03em] text-[#163F2C]">
                      {group.label}
                    </h3>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3 border-y border-[#EBE2DA] py-4">
                    {priceRows.map((priceRow) => (
                      <div key={priceRow.key} className="min-w-0">
                        <p className="text-[7px] uppercase tracking-[0.18em] text-[#7A847E]">
                          {priceRow.label}
                        </p>
                        <p className="mt-2 font-serif text-[0.96rem] leading-none tracking-[0.02em] text-[#30463B] md:text-[1.08rem]">
                          {formatClpPrice(priceRow.value)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <p className="text-[8px] uppercase tracking-[0.28em] text-[#8E9791]">
                      Colecciones
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.collectionLabels.map((collectionLabel) => (
                        <span
                          key={collectionLabel}
                          className="rounded-full border border-[#E9E0D8] bg-white/35 px-3 py-1.5 text-[10.5px] tracking-[0.02em] text-[#5C6962]"
                        >
                          {collectionLabel}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

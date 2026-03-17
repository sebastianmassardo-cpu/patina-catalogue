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
      <div className="relative overflow-hidden rounded-[2.25rem] border border-[#E6DDD5] bg-[linear-gradient(180deg,rgba(255,255,255,0.7),rgba(247,244,240,0.97))] px-6 py-7 shadow-[0_24px_60px_rgba(22,63,44,0.05)] md:px-8 md:py-9">
        <div className="absolute left-[-2rem] top-[-2rem] h-28 w-28 rounded-full bg-[#E8DED6]/50 blur-3xl" />
        <div className="absolute right-[-2rem] top-6 h-32 w-32 rounded-full bg-[#DCE5DE]/45 blur-3xl" />

        <div className="relative">
          <div className="flex flex-col gap-5 border-b border-[#E7DED6] pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] uppercase tracking-[0.32em] text-[#7A857E]">
                Precios por formato
              </p>
              <h2 className="mt-3 max-w-xl font-serif text-[1.55rem] leading-[1.12] tracking-[-0.03em] text-[#163F2C] md:text-[1.95rem]">
                Una guia serena para elegir formatos y combinaciones.
              </h2>
            </div>

            <p className="max-w-sm text-[12px] leading-6 text-[#738078] lg:text-right">
              Puedes combinar disenos dentro de un mismo grupo de precio.
            </p>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
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
                  className="rounded-[1.8rem] border border-[#E7DED6] bg-[#FCFAF7]/92 p-5 shadow-[0_16px_34px_rgba(22,63,44,0.04)] md:p-6"
                >
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#8A948E]">
                      Grupo de precio
                    </p>
                    <h3 className="mt-2 font-serif text-[1.22rem] leading-none tracking-[-0.025em] text-[#163F2C]">
                      {group.label}
                    </h3>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2.5">
                    {priceRows.map((priceRow) => (
                      <div
                        key={priceRow.key}
                        className="rounded-[1.1rem] border border-[#EEE6DF] bg-white/80 px-2.5 py-3 md:px-3"
                      >
                        <p className="text-[7px] uppercase tracking-[0.18em] text-[#7A857E]">
                          {priceRow.label}
                        </p>
                        <p className="mt-2 font-serif text-[0.9rem] leading-none tracking-[0.01em] text-[#415249] md:text-[1rem]">
                          {formatClpPrice(priceRow.value)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 border-t border-[#ECE3DB] pt-4">
                    <p className="text-[8px] uppercase tracking-[0.3em] text-[#8E9791]">
                      Colecciones
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.collectionLabels.map((collectionLabel) => (
                        <span
                          key={collectionLabel}
                          className="rounded-full bg-[#F3EEE7] px-3 py-1.5 text-[10.5px] tracking-[0.02em] text-[#5F6C65]"
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

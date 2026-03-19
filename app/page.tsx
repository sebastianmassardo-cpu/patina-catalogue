export const dynamic = 'force-dynamic'
import Image from 'next/image'
import { CatalogueBrowser } from './_components/catalogue-browser'
import {
  ContextEditorialSection,
  DetailEditorialSection,
  ProcessEditorialSection,
} from './_components/editorial-sections'
import { PricingSummary } from './_components/pricing-summary'
import type { PricingRow } from './catalogue-types'
import {
  buildPricingLookup,
  buildPricingSummaryGroups,
  isPackOnlyProduct,
  type PricingLookup,
} from './pricing-config'
import { supabase } from '../lib/supabase'

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'Disponible')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  const availableProducts = products ?? []
  const catalogueProducts = availableProducts.filter((product) => !isPackOnlyProduct(product))
  const pricingKeys = Array.from(
    new Set(
      catalogueProducts
        .map((product) => product.price_key?.trim())
        .filter((priceKey): priceKey is string => Boolean(priceKey))
    )
  )

  let pricingByKey: PricingLookup = {}
  let pricingRows: PricingRow[] = []

  if (pricingKeys.length > 0) {
    const { data: pricingData, error: pricingError } = await supabase
      .from('pricing')
      .select('id, price_key, price_1, price_2, price_4, created_at')
      .in('price_key', pricingKeys)

    if (pricingError) {
      console.error('Error loading pricing', pricingError.message)
    } else {
      pricingRows = pricingData ?? []
      pricingByKey = buildPricingLookup(pricingRows ?? [])
    }
  }

  const pricingSummaryGroups = buildPricingSummaryGroups(pricingRows, catalogueProducts)

  if (error) {
    return (
      <main className="min-h-screen bg-[#F7F4F0] px-6 py-12 text-[#163F2C] md:px-10 md:py-16">
        <div className="mx-auto max-w-3xl border-t border-[#DDD2C8] pt-8">
          <h1 className="font-serif text-2xl tracking-[-0.03em]">
            Error cargando catálogo
          </h1>
          <p className="mt-4 text-sm leading-7 text-red-700">{error.message}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F7F4F0] text-[#163F2C]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[18rem] bg-[linear-gradient(to_bottom,rgba(255,255,255,0.72),rgba(247,244,240,0))]" />
        <div className="absolute left-[-7rem] top-[-2rem] h-52 w-52 rounded-full bg-[#E8DED6]/65 blur-3xl" />
        <div className="absolute right-[-4rem] top-8 h-60 w-60 rounded-full bg-[#D9E1DA]/35 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 pb-5 pt-4 md:px-10 md:pb-8 md:pt-5">
          <header className="flex items-center justify-between gap-4 border-b border-[#E4DCD4] pb-4 md:pb-5">
            <div className="shrink-0">
              <Image
                src="/logo-patina.png"
                width={152}
                height={56}
                priority
                alt="PÁTINA"
                className="h-12 w-auto object-contain md:h-14"
              />
            </div>

            <div className="flex max-w-[13rem] flex-wrap justify-end gap-1.5 md:max-w-none">
              <a
                href="https://instagram.com/patina.vitreal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#DED4CB] bg-white/28 px-3.5 py-1.5 text-[8.5px] uppercase tracking-[0.22em] text-[#5A6960] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#D2C7BD] hover:bg-white/55 hover:text-[#163F2C]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.5" />
                  <circle cx="12" cy="12" r="4.1" />
                  <circle cx="17.4" cy="6.7" r="0.85" fill="currentColor" stroke="none" />
                </svg>
                Instagram
              </a>

              <a
                href="https://wa.me/56981447763"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#CFD8D1] bg-white/32 px-3.5 py-1.5 text-[8.5px] uppercase tracking-[0.22em] text-[#4F5F56] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#C4CEC8] hover:bg-white/58 hover:text-[#163F2C]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.1 11.5c0 4.5-3.7 8.1-8.3 8.1a8.7 8.7 0 0 1-4-.9l-3.9 1 1.1-3.7a7.9 7.9 0 0 1-1.4-4.5c0-4.5 3.7-8.1 8.3-8.1s8.2 3.6 8.2 8.1Z" />
                  <path d="M9.3 8.7c.2-.4.5-.4.7-.4h.6c.2 0 .4.1.5.4l.8 2.1c.1.2.1.5-.1.7l-.6.8c-.1.1-.1.3 0 .4.4.8 1 1.5 1.8 2 .1.1.3.1.5 0l1-.6c.2-.1.4-.1.6 0l2 .9c.2.1.3.3.3.5v.5c0 .2-.1.5-.4.6l-1.3.6c-.4.2-.9.2-1.3.1-1.1-.3-2.1-.8-3-1.5a10 10 0 0 1-2.5-2.8 6.5 6.5 0 0 1-.9-3.1c0-.4.1-.8.3-1.1l1-1.1Z" />
                </svg>
                WhatsApp
              </a>
            </div>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-10">
            <div className="max-w-xl">
              <p className="text-[10px] uppercase tracking-[0.34em] text-[#7A857E]">
                Catálogo disponible
              </p>

              <h1 className="mt-3 max-w-2xl font-serif text-[2.1rem] leading-[1.06] tracking-[-0.045em] text-[#163F2C] md:text-[2.85rem] lg:text-[3.25rem]">
                Copas pintadas a mano
              </h1>

              <p className="mt-4 max-w-md text-[14px] leading-6 text-[#5C6962] md:text-[15px] md:leading-7">
                Piezas únicas para regalar, coleccionar y compartir recuerdos que permanecen
              </p>

              <div className="mt-5">
                <a
                  href="https://wa.me/56981447763"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-full border border-[#163F2C] bg-[#163F2C] px-4 py-2 text-[9px] uppercase tracking-[0.2em] text-[#F7F4F0] shadow-[0_12px_28px_rgba(22,63,44,0.09)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#1B4A34] hover:shadow-[0_16px_32px_rgba(22,63,44,0.12)] md:text-[10px]"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-[#E5DDD6] bg-[#ECE3DB] shadow-[0_18px_48px_rgba(22,63,44,0.08)]">
              <Image
                src="/hero-patina.png"
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                alt="Copas pintadas a mano de PÁTINA"
                className="object-cover"
              />
              <div className="h-[19rem] md:h-[24rem] lg:h-[28rem]" />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-12">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-[#E8DED6]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.62),rgba(247,244,240,0.94))] px-6 py-12 md:px-8 md:py-14">
          <div className="absolute left-[-2rem] top-0 h-24 w-24 rounded-full bg-[#E8DED6]/45 blur-3xl" />
          <div className="absolute right-[-2rem] bottom-0 h-28 w-28 rounded-full bg-[#D9E1DA]/35 blur-3xl" />

          <div className="relative mx-auto max-w-2xl text-center">
            <p className="font-serif text-[1.65rem] leading-[1.18] tracking-[-0.035em] text-[#163F2C] md:text-[2.05rem]">
              El arte de lo irrepetible
            </p>
          </div>
        </div>
      </section>

      <ContextEditorialSection />
      <CatalogueBrowser
        packPricingGroups={pricingSummaryGroups}
        pricingByKey={pricingByKey}
        products={availableProducts}
      />
      <DetailEditorialSection />
      <ProcessEditorialSection />
      <PricingSummary groups={pricingSummaryGroups} />
    </main>
  )
}

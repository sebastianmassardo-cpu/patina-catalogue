'use client'

import { startTransition, useState } from 'react'
import type { Product } from '../catalogue-types'
import {
  formatClpPrice,
  getProductPricing,
  isPackOnlyProduct,
  type PricingLookup,
} from '../pricing-config'

const ALL_COLLECTIONS_ID = '__all__'
const ALL_COLLECTIONS_LABEL = 'Todas'

type CatalogueBrowserProps = {
  products: Product[]
  pricingByKey: PricingLookup
}

type CollectionChipProps = {
  isActive: boolean
  label: string
  onClick: () => void
}

function CollectionChip({ isActive, label, onClick }: CollectionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`inline-flex items-center rounded-full border px-3.5 py-1.5 text-[9px] uppercase tracking-[0.22em] transition-all duration-300 ease-out ${
        isActive
          ? 'border-[#B9C6BE] bg-[#F1F5F0] text-[#163F2C] shadow-[0_10px_20px_rgba(22,63,44,0.05)]'
          : 'border-[#E5DBD2] bg-white/24 text-[#738078] hover:-translate-y-0.5 hover:border-[#D4CAC1] hover:bg-white/52 hover:text-[#44544B]'
      }`}
    >
      {label}
    </button>
  )
}

function ProductCard({
  pricingByKey,
  product,
}: {
  pricingByKey: PricingLookup
  product: Product
}) {
  const pricing = getProductPricing(product, pricingByKey)
  const displayPrice = pricing?.price_1 ?? product.price_clp
  const hasPackPricing = Boolean(pricing?.price_2 || pricing?.price_4)
  const whatsappMessage = `Hola, me interesa la copa ${product.name}`
  const whatsappHref = `https://wa.me/56981447763?text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <article className="group transition-transform duration-300 ease-out hover:-translate-y-1">
      {product.hero_image_url ? (
        <div className="relative overflow-hidden rounded-[1.75rem] bg-[#E9E1DA] transition-shadow duration-300 ease-out group-hover:shadow-[0_18px_40px_rgba(22,63,44,0.08)]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-45 transition-opacity duration-300 ease-out group-hover:opacity-35" />
          <img
            src={product.hero_image_url}
            alt={product.name}
            className="h-[24.75rem] w-full object-cover transition-transform duration-350 ease-out group-hover:scale-[1.03] md:h-[26.5rem]"
          />
        </div>
      ) : (
        <div className="flex h-[24.75rem] items-center justify-center rounded-[1.75rem] bg-[#E9E1DA] text-[#6A756F] transition-shadow duration-300 ease-out group-hover:shadow-[0_18px_40px_rgba(22,63,44,0.08)] md:h-[26.5rem]">
          Sin imagen
        </div>
      )}

      <div className="mt-4.5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#8A948E]">
            {product.collection?.trim() || 'Colección'}
          </p>

          <h2 className="mt-2 font-serif text-[1.5rem] leading-[1.18] tracking-[-0.035em] text-[#163F2C]">
            {product.name}
          </h2>
        </div>

        <div className="shrink-0 pt-1 text-right">
          <p className="text-[8px] uppercase tracking-[0.32em] text-[#909994]">
            Pieza
          </p>
          <p className="mt-1 font-serif text-[1.05rem] tracking-[0.03em] text-[#4E5E56] md:text-[1.12rem]">
            {formatClpPrice(displayPrice)}
          </p>
        </div>
      </div>

      <p className="mt-3 max-w-[32rem] text-[13px] leading-6 text-[#647069]">
        {product.description || 'Copa única pintada a mano.'}
      </p>

      {hasPackPricing ? (
        <p className="mt-3.5 text-[10px] uppercase tracking-[0.2em] text-[#87918C]">
          Disponible en packs
        </p>
      ) : null}

      <div className="mt-4">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-full border border-[#D8CEC4] bg-white/24 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.2em] text-[#163F2C] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#C9BEB3] hover:bg-white/62 hover:text-[#133625]"
        >
          Consultar esta copa
        </a>
      </div>
    </article>
  )
}

export function CatalogueBrowser({ pricingByKey, products }: CatalogueBrowserProps) {
  const catalogueProducts = products.filter((product) => !isPackOnlyProduct(product))

  const collectionValues = catalogueProducts
    .map((product) => product.collection?.trim())
    .filter((collection): collection is string => Boolean(collection))
  const collections = [
    { id: ALL_COLLECTIONS_ID, label: ALL_COLLECTIONS_LABEL },
    ...Array.from(new Set(collectionValues)).map((collection) => ({
      id: collection,
      label: collection,
    })),
  ]

  const [activeCollectionId, setActiveCollectionId] = useState(ALL_COLLECTIONS_ID)
  const activeCollectionLabel =
    activeCollectionId === ALL_COLLECTIONS_ID
      ? ALL_COLLECTIONS_LABEL
      : activeCollectionId

  const visibleProducts =
    activeCollectionId === ALL_COLLECTIONS_ID
      ? catalogueProducts
      : catalogueProducts.filter(
          (product) => product.collection?.trim() === activeCollectionId
        )

  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-2 md:px-10 md:pb-28 md:pt-4">
      {!catalogueProducts.length ? (
        <div className="max-w-2xl border-t border-[#DDD2C8] pt-10">
          <p className="font-serif text-lg tracking-[-0.02em]">
            No hay copas disponibles por ahora.
          </p>
          <p className="mt-3 text-sm leading-7 text-[#5E6C64]">
            Vuelve pronto para ver nuevas piezas.
          </p>
        </div>
      ) : (
        <>
          <div className="border-t border-[#E3DAD2] pt-5">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="text-[11px] uppercase tracking-[0.34em] text-[#7A857E]">
                  Colecciones
                </p>
                <p className="mt-3 text-sm leading-7 text-[#69736D]">
                  Recorre el catálogo por series, afinidades y gestos que comparten
                  una misma atmósfera.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 lg:max-w-3xl lg:justify-end">
                {collections.map((collection) => (
                  <CollectionChip
                    key={collection.id}
                    label={collection.label}
                    isActive={activeCollectionId === collection.id}
                    onClick={() => {
                      startTransition(() => {
                        setActiveCollectionId(collection.id)
                      })
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8 mt-7 flex flex-col gap-3 border-t border-[#E8E0D8] pt-5 md:mb-10 md:mt-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#7A857E]">
                Galería
              </p>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#69736D]">
                {activeCollectionId === ALL_COLLECTIONS_ID
                  ? 'Vista completa del catálogo, dispuesta con un ritmo sereno y visual.'
                  : `Piezas reunidas en torno a la colección ${activeCollectionLabel}.`}
              </p>
            </div>

            <p className="font-serif text-[0.98rem] tracking-[0.04em] text-[#55645C]">
              {activeCollectionId === ALL_COLLECTIONS_ID
                ? 'Todas las piezas disponibles'
                : activeCollectionLabel}
            </p>
          </div>

          <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:gap-y-[3.25rem] 2xl:grid-cols-3">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} pricingByKey={pricingByKey} product={product} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

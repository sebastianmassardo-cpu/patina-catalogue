'use client'

import Image from 'next/image'
import { startTransition, useState } from 'react'
import {
  formatCollectionLabel,
  formatProductDescription,
  getProductGlassType,
  type GlassTypeOption,
} from '../catalogue-display'
import type { Product } from '../catalogue-types'
import {
  formatClpPrice,
  getProductPricing,
  isPackOnlyProduct,
  type PricingLookup,
  type PricingSummaryGroup,
} from '../pricing-config'

const ALL_COLLECTIONS_ID = '__all__'
const ALL_COLLECTIONS_LABEL = 'Todas'
const ALL_PRICE_FILTER_ID = '__all_prices__'
const ALL_PRICE_FILTER_LABEL = 'Todos'
const ALL_GLASS_TYPES_ID = '__all_glass_types__'
const ALL_GLASS_TYPES_LABEL = 'Todos'

type CatalogueBrowserProps = {
  packPricingGroups: PricingSummaryGroup[]
  products: Product[]
  pricingByKey: PricingLookup
}

type FilterChipProps = {
  isActive: boolean
  label: string
  onClick: () => void
}

type PriceFilterOption = {
  id: string
  label: string
  minPrice: number | null
  maxPrice: number | null
}

type GlassTypeFilterOption = Pick<GlassTypeOption, 'id' | 'label'>

const CURATED_PRICE_FILTERS: PriceFilterOption[] = [
  {
    id: 'price-up-to-13990',
    label: 'Hasta $13.990',
    minPrice: null,
    maxPrice: 13990,
  },
  {
    id: 'price-14000-15990',
    label: '$14.000 a $15.990',
    minPrice: 14000,
    maxPrice: 15990,
  },
  {
    id: 'price-from-16000',
    label: 'Desde $16.000',
    minPrice: 16000,
    maxPrice: null,
  },
]

const PACK_PRICE_LABELS = [
  { key: 'price_1', label: '1 copa' },
  { key: 'price_2', label: '2 copas' },
  { key: 'price_4', label: '4 copas' },
] as const

function FilterChip({ isActive, label, onClick }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isActive}
      className={`inline-flex shrink-0 items-center rounded-full border px-3.5 py-1.5 text-[9px] uppercase tracking-[0.22em] whitespace-nowrap transition-all duration-300 ease-out ${
        isActive
          ? 'border-[#B9C6BE] bg-[#F1F5F0] text-[#163F2C] shadow-[0_10px_20px_rgba(22,63,44,0.05)]'
          : 'border-[#E5DBD2] bg-white/24 text-[#738078] hover:-translate-y-0.5 hover:border-[#D4CAC1] hover:bg-white/52 hover:text-[#44544B]'
      }`}
    >
      {label}
    </button>
  )
}

function getDisplayPrice(product: Product, pricingByKey: PricingLookup) {
  const pricing = getProductPricing(product, pricingByKey)
  return pricing?.price_1 ?? product.price_clp
}

function priceMatchesRange(displayPrice: number, priceFilter: PriceFilterOption) {
  if (priceFilter.minPrice !== null && displayPrice < priceFilter.minPrice) {
    return false
  }

  if (priceFilter.maxPrice !== null && displayPrice > priceFilter.maxPrice) {
    return false
  }

  return true
}

function buildPriceFilterOptions(
  products: Product[],
  pricingByKey: PricingLookup
): PriceFilterOption[] {
  return [
    {
      id: ALL_PRICE_FILTER_ID,
      label: ALL_PRICE_FILTER_LABEL,
      minPrice: null,
      maxPrice: null,
    },
    ...CURATED_PRICE_FILTERS.filter((priceFilter) =>
      products.some((product) =>
        priceMatchesRange(getDisplayPrice(product, pricingByKey), priceFilter)
      )
    ),
  ]
}

function matchesPriceFilter(
  product: Product,
  pricingByKey: PricingLookup,
  activePriceFilter: PriceFilterOption
) {
  const displayPrice = getDisplayPrice(product, pricingByKey)
  return priceMatchesRange(displayPrice, activePriceFilter)
}

function buildGlassTypeFilterOptions(products: Product[]): GlassTypeFilterOption[] {
  const glassTypesById = products.reduce<Map<string, GlassTypeFilterOption>>((lookup, product) => {
    const glassType = getProductGlassType(product)

    if (glassType && !lookup.has(glassType.id)) {
      lookup.set(glassType.id, {
        id: glassType.id,
        label: glassType.label,
      })
    }

    return lookup
  }, new Map())

  return [
    {
      id: ALL_GLASS_TYPES_ID,
      label: ALL_GLASS_TYPES_LABEL,
    },
    ...Array.from(glassTypesById.values()).sort((left, right) =>
      left.label.localeCompare(right.label, 'es', { sensitivity: 'base' })
    ),
  ]
}

function matchesGlassTypeFilter(product: Product, activeGlassTypeId: string) {
  return (
    activeGlassTypeId === ALL_GLASS_TYPES_ID ||
    getProductGlassType(product)?.id === activeGlassTypeId
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
  const glassType = getProductGlassType(product)
  const description = formatProductDescription(product)
  const displayPrice = getDisplayPrice(product, pricingByKey)
  const hasPackPricing = Boolean(pricing?.price_2 || pricing?.price_4)
  const whatsappMessage = `Hola, me interesa la copa ${product.name}`
  const whatsappHref = `https://wa.me/56981447763?text=${encodeURIComponent(
    whatsappMessage
  )}`

  return (
    <article className="group transition-transform duration-300 ease-out hover:-translate-y-1">
      {product.hero_image_url ? (
        <div className="relative h-[24.75rem] overflow-hidden rounded-[1.75rem] bg-[#FBF9F6] transition-shadow duration-300 ease-out group-hover:shadow-[0_18px_40px_rgba(22,63,44,0.08)] md:h-[27.25rem]">
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-45 transition-opacity duration-300 ease-out group-hover:opacity-35 md:opacity-22 md:group-hover:opacity-16" />
          <div className="flex h-full items-center justify-center md:px-0 md:pb-0 md:pt-1">
            <Image
              src={product.hero_image_url}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 28vw, (min-width: 768px) 42vw, 100vw"
              className="object-cover object-center transition-transform duration-350 ease-out group-hover:scale-[1.03] md:scale-[1.04] md:object-contain md:object-[center_89%] md:group-hover:scale-[1.055]"
            />
          </div>
        </div>
      ) : (
        <div className="flex h-[24.75rem] items-center justify-center overflow-hidden rounded-[1.75rem] bg-[#FBF9F6] text-[#6A756F] transition-shadow duration-300 ease-out group-hover:shadow-[0_18px_40px_rgba(22,63,44,0.08)] md:h-[27.25rem]">
          Sin imagen
        </div>
      )}

      <div className="mt-4.5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[9px] uppercase tracking-[0.4em] text-[#8A948E]">
            {formatCollectionLabel(product.collection)}
          </p>

          <h2 className="mt-2 font-serif text-[1.5rem] leading-[1.18] tracking-[-0.035em] text-[#163F2C]">
            {product.name}
          </h2>

          {glassType ? (
            <p className="mt-2 font-serif text-[0.98rem] italic leading-snug tracking-[-0.01em] text-[#66736B]">
              {glassType.displayLabel}
            </p>
          ) : null}
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
        {description}
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

function PackPricingMenu({ groups }: { groups: PricingSummaryGroup[] }) {
  return (
    <div className="rounded-[1.7rem] border border-[#E8DED6] bg-[linear-gradient(180deg,rgba(255,255,255,0.6),rgba(247,244,240,0.92))] px-4 py-4 shadow-[0_14px_30px_rgba(22,63,44,0.04)] md:px-5 md:py-5">
      <div className="max-w-xl">
        <p className="text-[8px] uppercase tracking-[0.28em] text-[#7A857E]">Menú de packs</p>
        <p className="mt-2 font-serif text-[1.08rem] leading-[1.16] tracking-[-0.03em] text-[#163F2C] md:text-[1.18rem]">
          Colecciones y packs.
        </p>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-3">
        {groups.map((group) => {
          const priceRows = PACK_PRICE_LABELS.reduce<
            Array<{
              key: (typeof PACK_PRICE_LABELS)[number]['key']
              label: (typeof PACK_PRICE_LABELS)[number]['label']
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
              className="rounded-[1.35rem] border border-[#ECE2D9] bg-white/52 px-4 py-4"
            >
              <div>
                <p className="text-[8px] uppercase tracking-[0.28em] text-[#8D9690]">
                  Grupo de precio
                </p>
                <h3 className="mt-2 font-serif text-[1.08rem] leading-none tracking-[-0.03em] text-[#163F2C]">
                  {group.label}
                </h3>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-y border-[#ECE2D9] py-3">
                {priceRows.map((priceRow) => (
                  <div key={priceRow.key} className="min-w-0">
                    <p className="text-[7px] uppercase tracking-[0.18em] text-[#7A847E]">
                      {priceRow.label}
                    </p>
                    <p className="mt-2 font-serif text-[0.9rem] leading-none tracking-[0.02em] text-[#30463B] md:text-[0.98rem]">
                      {formatClpPrice(priceRow.value)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {group.collectionLabels.map((collectionLabel) => (
                  <span
                    key={collectionLabel}
                    className="rounded-full border border-[#E9E0D8] bg-white/42 px-3 py-1.5 text-[10px] tracking-[0.02em] text-[#5C6962]"
                  >
                    {formatCollectionLabel(collectionLabel)}
                  </span>
                ))}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}

export function CatalogueBrowser({
  packPricingGroups,
  pricingByKey,
  products,
}: CatalogueBrowserProps) {
  const catalogueProducts = products.filter((product) => !isPackOnlyProduct(product))
  const sortedCatalogueProducts = [...catalogueProducts].sort((left, right) => {
    const leftCollection = left.collection?.trim() || ''
    const rightCollection = right.collection?.trim() || ''

    return (
      leftCollection.localeCompare(rightCollection, 'es', { sensitivity: 'base' }) ||
      left.name.localeCompare(right.name, 'es', { sensitivity: 'base' })
    )
  })

  const collectionValues = sortedCatalogueProducts
    .map((product) => product.collection?.trim())
    .filter((collection): collection is string => Boolean(collection))
  const collections = [
    { id: ALL_COLLECTIONS_ID, label: ALL_COLLECTIONS_LABEL },
    ...Array.from(new Set(collectionValues))
      .sort((left, right) => left.localeCompare(right, 'es', { sensitivity: 'base' }))
      .map((collection) => ({
        id: collection,
        label: formatCollectionLabel(collection),
      })),
  ]
  const priceFilterOptions = buildPriceFilterOptions(sortedCatalogueProducts, pricingByKey)
  const glassTypeFilterOptions = buildGlassTypeFilterOptions(sortedCatalogueProducts)

  const [activeCollectionId, setActiveCollectionId] = useState(ALL_COLLECTIONS_ID)
  const [activePriceFilterId, setActivePriceFilterId] = useState(ALL_PRICE_FILTER_ID)
  const [activeGlassTypeId, setActiveGlassTypeId] = useState(ALL_GLASS_TYPES_ID)
  const [isPackMenuOpen, setIsPackMenuOpen] = useState(false)

  const activeCollectionLabel =
    activeCollectionId === ALL_COLLECTIONS_ID
      ? ALL_COLLECTIONS_LABEL
      : formatCollectionLabel(activeCollectionId)
  const activePriceFilter =
    priceFilterOptions.find((priceFilter) => priceFilter.id === activePriceFilterId) ??
    priceFilterOptions[0]
  const activePriceFilterLabel =
    activePriceFilter.id === ALL_PRICE_FILTER_ID ? ALL_PRICE_FILTER_LABEL : activePriceFilter.label
  const activeGlassType =
    glassTypeFilterOptions.find((glassType) => glassType.id === activeGlassTypeId) ??
    glassTypeFilterOptions[0]
  const activeGlassTypeLabel =
    activeGlassType.id === ALL_GLASS_TYPES_ID ? ALL_GLASS_TYPES_LABEL : activeGlassType.label

  const collectionFilteredProducts =
    activeCollectionId === ALL_COLLECTIONS_ID
      ? sortedCatalogueProducts
      : sortedCatalogueProducts.filter(
          (product) => product.collection?.trim() === activeCollectionId
        )
  const glassTypeFilteredProducts = collectionFilteredProducts.filter((product) =>
    matchesGlassTypeFilter(product, activeGlassType.id)
  )
  const visibleProducts = glassTypeFilteredProducts.filter((product) =>
    matchesPriceFilter(product, pricingByKey, activePriceFilter)
  )
  const activeFilterCount =
    Number(activeCollectionId !== ALL_COLLECTIONS_ID) +
    Number(activeGlassType.id !== ALL_GLASS_TYPES_ID) +
    Number(activePriceFilter.id !== ALL_PRICE_FILTER_ID)
  const gallerySummary =
    activeFilterCount === 0
      ? 'Todas las piezas disponibles'
      : [activeCollectionId !== ALL_COLLECTIONS_ID ? activeCollectionLabel : null]
          .concat(activeGlassType.id !== ALL_GLASS_TYPES_ID ? activeGlassTypeLabel : null)
          .concat(activePriceFilter.id !== ALL_PRICE_FILTER_ID ? activePriceFilterLabel : null)
          .filter((value): value is string => Boolean(value))
          .join(' · ')
  const catalogueCountLabel = `${visibleProducts.length} pieza${
    visibleProducts.length === 1 ? '' : 's'
  }`

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
            <div className="relative overflow-hidden rounded-[2rem] border border-[#E7DDD4] bg-[linear-gradient(180deg,rgba(255,255,255,0.68),rgba(247,244,240,0.96))] px-4 py-5 shadow-[0_18px_42px_rgba(22,63,44,0.05)] md:px-5 md:py-6">
              <div className="absolute left-[-1rem] top-[-1rem] h-20 w-20 rounded-full bg-[#E8DED6]/35 blur-3xl" />
              <div className="absolute right-[-1.5rem] bottom-[-1.5rem] h-24 w-24 rounded-full bg-[#DCE5DE]/35 blur-3xl" />

              <div className="relative flex flex-col gap-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                  <div className="max-w-xl">
                    <p className="text-[10px] uppercase tracking-[0.32em] text-[#7A857E]">
                      Explorar
                    </p>
                    <p className="mt-3 font-serif text-[1.25rem] leading-[1.14] tracking-[-0.03em] text-[#163F2C] md:text-[1.45rem]">
                      Colecciones, tipos y precios.
                    </p>
                    <p className="mt-2 max-w-md text-[12px] leading-6 text-[#647069] md:text-[13px]">
                      Filtra la selección sin perder la calma visual del catálogo.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex rounded-full border border-[#E5DBD2] bg-white/42 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[#5D6C64]">
                      {catalogueCountLabel}
                    </span>

                    {packPricingGroups.length ? (
                      <button
                        type="button"
                        aria-expanded={isPackMenuOpen}
                        onClick={() => {
                          setIsPackMenuOpen((isOpen) => !isOpen)
                        }}
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] transition-all duration-300 ease-out ${
                          isPackMenuOpen
                            ? 'border-[#C9D5CD] bg-[#F1F5F0] text-[#163F2C] shadow-[0_10px_20px_rgba(22,63,44,0.05)]'
                            : 'border-[#E5DBD2] bg-white/42 text-[#5D6C64] hover:-translate-y-0.5 hover:border-[#D4CAC1] hover:bg-white/68 hover:text-[#163F2C]'
                        }`}
                      >
                        Ver packs
                        <svg
                          aria-hidden="true"
                          viewBox="0 0 12 12"
                          className={`h-3 w-3 transition-transform duration-300 ${
                            isPackMenuOpen ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M2.25 4.5 6 8.1 9.75 4.5" />
                        </svg>
                      </button>
                    ) : null}

                    {activeFilterCount > 0 ? (
                      <button
                        type="button"
                        onClick={() => {
                          startTransition(() => {
                            setActiveCollectionId(ALL_COLLECTIONS_ID)
                            setActiveGlassTypeId(ALL_GLASS_TYPES_ID)
                            setActivePriceFilterId(ALL_PRICE_FILTER_ID)
                          })
                        }}
                        className="inline-flex rounded-full border border-[#D9CEC5] bg-white/46 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[#163F2C] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-[#CDBFB4] hover:bg-white/70"
                      >
                        Limpiar filtros
                      </button>
                    ) : null}
                  </div>
                </div>

                {isPackMenuOpen && packPricingGroups.length ? (
                  <PackPricingMenu groups={packPricingGroups} />
                ) : null}

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_minmax(0,0.8fr)]">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.28em] text-[#8A948E]">
                      Colección
                    </p>

                    <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
                      {collections.map((collection) => (
                        <FilterChip
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

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.28em] text-[#8A948E]">
                      Tipo de copa
                    </p>

                    <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
                      {glassTypeFilterOptions.map((glassType) => (
                        <FilterChip
                          key={glassType.id}
                          label={glassType.label}
                          isActive={activeGlassType.id === glassType.id}
                          onClick={() => {
                            startTransition(() => {
                              setActiveGlassTypeId(glassType.id)
                            })
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[9px] uppercase tracking-[0.28em] text-[#8A948E]">
                      Precio
                    </p>

                    <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 md:pb-0">
                      {priceFilterOptions.map((priceFilter) => (
                        <FilterChip
                          key={priceFilter.id}
                          label={priceFilter.label}
                          isActive={activePriceFilter.id === priceFilter.id}
                          onClick={() => {
                            startTransition(() => {
                              setActivePriceFilterId(priceFilter.id)
                            })
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 border-t border-[#E8DED6] pt-4">
                  {activeCollectionId !== ALL_COLLECTIONS_ID ? (
                    <span className="inline-flex rounded-full border border-[#E5DBD2] bg-white/36 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[#5B6A62]">
                      {activeCollectionLabel}
                    </span>
                  ) : null}

                  {activeGlassType.id !== ALL_GLASS_TYPES_ID ? (
                    <span className="inline-flex rounded-full border border-[#E5DBD2] bg-white/36 px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[#5B6A62]">
                      {activeGlassTypeLabel}
                    </span>
                  ) : null}

                  {activePriceFilter.id !== ALL_PRICE_FILTER_ID ? (
                    <span className="inline-flex rounded-full border border-[#DCE4DE] bg-[#F1F5F0] px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[#44554C]">
                      {activePriceFilterLabel}
                    </span>
                  ) : null}

                  {activeFilterCount === 0 ? (
                    <span className="inline-flex rounded-full border border-[#E8DED6] bg-transparent px-3 py-1.5 text-[9px] uppercase tracking-[0.22em] text-[#7A857E]">
                      Sin filtros activos
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8 mt-7 flex flex-col gap-3 border-t border-[#E8E0D8] pt-5 md:mb-10 md:mt-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.34em] text-[#7A857E]">
                Galería
              </p>
            </div>

            <p className="font-serif text-[0.98rem] tracking-[0.04em] text-[#55645C]">
              {gallerySummary}
            </p>
          </div>

          {!visibleProducts.length ? (
            <div className="rounded-[1.85rem] border border-[#E5DDD5] bg-[linear-gradient(180deg,rgba(255,255,255,0.52),rgba(247,244,240,0.92))] px-5 py-8 text-center md:px-6 md:py-10">
              <p className="font-serif text-[1.15rem] tracking-[-0.02em] text-[#163F2C]">
                No hay copas con estos filtros.
              </p>
              <p className="mt-3 text-[13px] leading-6 text-[#617067]">
                Ajusta la selección para volver a ver el catálogo completo.
              </p>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 md:gap-x-7 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-[3.25rem]">
              {visibleProducts.map((product) => (
                <ProductCard key={product.id} pricingByKey={pricingByKey} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export type Product = {
  id: string
  name: string
  slug: string
  price_key?: string | null
  price_clp: number
  status: string
  collection: string | null
  description: string | null
  hero_image_url: string | null
  created_at?: string
  sort_order?: number
}

export type PricingRow = {
  id: string
  price_key: string | null
  price_1: number | null
  price_2: number | null
  price_4: number | null
  created_at?: string | null
}

export type PriceRule = {
  id?: string
  glass_key: string | null
  design_key: string | null
  price_1: number | null
  price_2: number | null
  price_4: number | null
  created_at?: string | null
  updated_at?: string | null
}

export type CollectionPricingRule = {
  id?: string
  collection_key: string | null
  design_key: string | null
  created_at?: string | null
  updated_at?: string | null
}

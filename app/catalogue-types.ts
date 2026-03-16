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

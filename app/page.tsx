import { supabase } from '../lib/supabase'

type Product = {
  id: string
  name: string
  slug: string
  price_clp: number
  status: string
  collection: string | null
  description: string | null
  hero_image_url: string | null
  created_at?: string
  sort_order?: number
}

export default async function Home() {
const { data: products, error } = await supabase
  .from('products')
  .select('*')
  .eq('status', 'Disponible')
  .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="p-10">
        <h1 className="text-2xl font-semibold">Error cargando catálogo</h1>
        <p className="mt-4 text-red-600">{error.message}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-stone-50 px-6 py-12 text-stone-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
            PÁTINA
          </p>
          <h1 className="mt-3 text-4xl font-semibold">Catálogo de copas</h1>
          <p className="mt-4 max-w-2xl text-stone-600">
            Piezas únicas pintadas a mano. El catálogo se actualiza automáticamente según el stock.
          </p>
          <p className="mt-4 text-sm text-stone-500">
            Productos encontrados: {products?.length ?? 0}
          </p>
        </header>

        {!products || products.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-stone-200">
            <p className="text-lg font-medium">No hay productos visibles todavía.</p>
            <p className="mt-2 text-stone-600">
              Si en Supabase sí existen productos, probablemente el problema sea RLS o los datos de la tabla.
            </p>

            <pre className="mt-6 overflow-auto rounded-xl bg-stone-100 p-4 text-sm">
              {JSON.stringify(products, null, 2)}
            </pre>
          </div>
        ) : (
          <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product: Product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-stone-200"
              >
                {product.hero_image_url ? (
                  <img
                    src={product.hero_image_url}
                    alt={product.name}
                    className="h-80 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-80 items-center justify-center bg-stone-200 text-stone-500">
                    Sin imagen
                  </div>
                )}

                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-400">
                    {product.collection || 'Colección'}
                  </p>

                  <h2 className="mt-2 text-2xl font-medium">{product.name}</h2>

                  <p className="mt-2 text-lg">
                    ${product.price_clp?.toLocaleString('es-CL')}
                  </p>

                  <p className="mt-2 text-sm text-stone-500">
                    Estado: {product.status}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {product.description || 'Copa única pintada a mano.'}
                  </p>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  )
}
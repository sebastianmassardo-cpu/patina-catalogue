export const dynamic = 'force-dynamic'
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
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <main className="min-h-screen bg-[#F4EFEB] px-6 py-12 text-[#163F2C]">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-[#D9D0C8] bg-white/70 p-8 shadow-sm">
          <h1 className="text-2xl font-semibold">Error cargando catálogo</h1>
          <p className="mt-4 text-red-700">{error.message}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F4EFEB] text-[#163F2C]">
      <section className="relative overflow-hidden border-b border-[#DDD3CB]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(22,63,44,0.05),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(120,94,67,0.08),_transparent_28%),linear-gradient(to_bottom,_#F7F2EE,_#F2ECE7)]" />
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#D8CDC3]/40 blur-3xl" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#163F2C]/[0.05] blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
          <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/logo-patina.png"
                alt="PÁTINA"
                className="h-12 w-auto object-contain md:h-14"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="https://instagram.com/patina-vitreal"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-[#CFC1B5] bg-white/80 px-4 py-2.5 text-sm text-[#163F2C] backdrop-blur transition hover:bg-white"
              >
                Instagram
              </a>

              <a
                href="https://wa.me/56981447763"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-[#163F2C] px-4 py-2.5 text-sm text-white shadow-sm transition hover:opacity-90"
              >
                WhatsApp
              </a>
            </div>
          </header>

          <div className="mt-14 grid gap-10 md:mt-20 md:grid-cols-[1.18fr_0.82fr] md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.38em] text-[#6B7A70]">
                Colección disponible
              </p>

              <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[1.03] tracking-[-0.04em] text-[#163F2C] md:text-7xl">
                Copas pintadas a mano con presencia, carácter y delicadeza.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#55635B] md:text-xl">
                Cada pieza es única y está pensada para transformar un objeto cotidiano
                en algo especial, coleccionable y memorable.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="https://instagram.com/patina-vitreal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-[#163F2C] px-6 py-3 text-sm text-white shadow-sm transition hover:opacity-90"
                >
                  Ver Instagram
                </a>

                <a
                  href="https://wa.me/56981447763"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-[#CDBFB3] bg-white/75 px-6 py-3 text-sm text-[#163F2C] backdrop-blur transition hover:bg-white"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/70 bg-white/65 p-8 shadow-[0_20px_60px_rgba(22,63,44,0.08)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-[#7B8A80]">
                Disponibles
              </p>

              <div className="mt-4 flex items-end gap-3">
                <p className="text-6xl font-semibold tracking-[-0.05em] text-[#163F2C]">
                  {products?.length ?? 0}
                </p>
                <p className="pb-2 text-sm text-[#68756E]">
                  piezas en catálogo
                </p>
              </div>

              <div className="mt-8 h-px bg-gradient-to-r from-transparent via-[#D5CBC2] to-transparent" />

              <p className="mt-8 text-sm leading-7 text-[#5E6C64]">
                Una selección curada de piezas listas para regalar, coleccionar
                o incorporar a una mesa con identidad propia.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        {!products || products.length === 0 ? (
          <div className="rounded-[2rem] border border-[#DDD3CB] bg-white/80 p-10 shadow-sm">
            <p className="text-lg font-medium">No hay copas disponibles por ahora.</p>
            <p className="mt-2 text-[#5E6C64]">
              Vuelve pronto para ver nuevas piezas.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {products.map((product: Product) => (
              <article
                key={product.id}
                className="group overflow-hidden rounded-[2rem] border border-[#DED4CC] bg-white/92 shadow-[0_10px_30px_rgba(22,63,44,0.05)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(22,63,44,0.09)]"
              >
                {product.hero_image_url ? (
                  <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-70" />
                    <img
                      src={product.hero_image_url}
                      alt={product.name}
                      className="h-[26rem] w-full object-cover transition duration-700 group-hover:scale-[1.04]"
                    />
                  </div>
                ) : (
                  <div className="flex h-[26rem] items-center justify-center bg-[#E9E1DA] text-[#6A756F]">
                    Sin imagen
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.28em] text-[#6F7E74]">
                        {product.collection || 'Colección'}
                      </p>

                      <h2 className="mt-3 text-2xl font-semibold tracking-[-0.02em] text-[#163F2C]">
                        {product.name}
                      </h2>
                    </div>

                    <div className="rounded-full border border-[#D8CCC2] bg-[#F8F2EC] px-3 py-1 text-sm font-medium text-[#163F2C]">
                      ${product.price_clp?.toLocaleString('es-CL')}
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[#5E6C64]">
                    {product.description || 'Copa única pintada a mano.'}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <a
                      href="https://instagram.com/patina-vitreal"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#163F2C] px-4 py-2.5 text-sm text-white transition hover:opacity-90"
                    >
                      Reservar por Instagram
                    </a>

                    <a
                      href="https://wa.me/56981447763"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#D1C4B9] px-4 py-2.5 text-sm text-[#163F2C] transition hover:bg-[#F7F2ED]"
                    >
                      Consultar
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
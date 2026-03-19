import Image from 'next/image'

const CONTEXT_IMAGES = [
  '/editorial/context/context-01.png',
  '/editorial/context/context-02.png',
] as const

const DETAIL_IMAGES = [
  '/editorial/detail/detail-01.png',
  '/editorial/detail/detail-02.png',
] as const

const PROCESS_STEPS = [
  {
    image: '/editorial/process/process-01.png',
    label: 'Selección',
    note: 'El vidrio se elige por su proporción, su brillo y su presencia.',
  },
  {
    image: '/editorial/process/process-02.png',
    label: 'Pintura a mano',
    note: 'Cada motivo se construye a pulso, con capas leves y un ritmo lento.',
  },
  {
    image: '/editorial/process/process-03.png',
    label: 'Terminación',
    note: 'La pieza encuentra su tono final en un acabado sobrio y preciso.',
  },
] as const

function EditorialImage({
  alt,
  className,
  sizes = '(min-width: 1024px) 32vw, 100vw',
  src,
}: {
  alt: string
  className: string
  sizes?: string
  src: string
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] bg-[#E8E0D7] shadow-[0_26px_58px_rgba(22,63,44,0.07)] ${className}`}
    >
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/10 via-transparent to-white/10 opacity-35 transition-opacity duration-300 ease-out group-hover:opacity-20" />
      <div className="absolute inset-0 z-10 ring-1 ring-inset ring-white/40" />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      />
    </div>
  )
}

function EditorialTextBlock({
  title,
  eyebrow,
  body,
  align = 'left',
}: {
  title: string
  eyebrow: string
  body: string
  align?: 'left' | 'center'
}) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-xl text-center' : 'max-w-md'}>
      <p className="text-[10px] uppercase tracking-[0.32em] text-[#7A857E]">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-[1.72rem] leading-[1.12] tracking-[-0.038em] text-[#163F2C] md:text-[2.12rem]">
        {title}
      </h2>
      {body ? <p className="mt-4 text-[13px] leading-7 text-[#66736C]">{body}</p> : null}
    </div>
  )
}

export function ContextEditorialSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-14 pt-10 md:px-10 md:pb-24 md:pt-20">
      <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] lg:items-center lg:gap-10 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-14">
        <div className="lg:max-w-[16rem] lg:justify-self-start">
          <EditorialTextBlock
            eyebrow="EL MOMENTO"
            title="Enmarca tus celebraciones."
            body=""
          />
        </div>

        <div className="relative isolate lg:pb-14">
            <div className="relative overflow-hidden rounded-[2.15rem] bg-[#F3EEE8] shadow-[0_30px_64px_rgba(22,63,44,0.08)]">
              <Image
                src={CONTEXT_IMAGES[0]}
                fill
                priority
                sizes="(min-width: 1280px) 58vw, 100vw"
              alt="Copas PÁTINA en un contexto de mesa"
                className="object-cover"
              />
              <div className="h-[25rem] md:h-[35rem] lg:h-[39rem]" />
          </div>

          <div className="ml-auto mt-4 w-[72%] sm:w-[60%] md:mt-5 md:w-[45%] lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:w-[34%] xl:w-[32%]">
            <div className="rounded-[1.8rem] bg-[#FBF8F4] p-1.5 shadow-[0_22px_44px_rgba(22,63,44,0.12)] ring-1 ring-[#EEE5DC]/85">
              <div className="relative overflow-hidden rounded-[1.45rem]">
                <Image
                  src={CONTEXT_IMAGES[1]}
                  fill
                  sizes="(min-width: 1280px) 22vw, 72vw"
                  alt="Detalle de copas PÁTINA en un contexto cotidiano"
                  className="object-cover"
                />
                <div className="h-[18rem] md:h-[22rem] lg:h-[24rem]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function DetailEditorialSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-24">
      <div className="relative overflow-hidden rounded-[2.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.46),rgba(247,244,240,0.9))] px-6 py-8 md:px-8 md:py-10">
        <div className="absolute left-[-3rem] top-8 h-32 w-32 rounded-full bg-[#E8DED6]/35 blur-3xl" />
        <div className="absolute right-[-3rem] bottom-8 h-36 w-36 rounded-full bg-[#D9E1DA]/28 blur-3xl" />

        <div className="relative grid gap-8 lg:grid-cols-[minmax(0,0.58fr)_minmax(0,0.42fr)] lg:items-center lg:gap-10">
          <div className="grid gap-4 md:grid-cols-[minmax(0,0.54fr)_minmax(0,0.46fr)] md:items-end md:gap-5">
            <div className="md:pb-14">
              <EditorialImage
                src={DETAIL_IMAGES[0]}
                alt="Detalle de trazo pintado a mano sobre vidrio"
                className="h-[21rem] md:h-[27rem]"
              />
            </div>
            <EditorialImage
              src={DETAIL_IMAGES[1]}
              alt="Close-up de detalle pintado a mano en una copa"
              className="h-[25rem] md:h-[33rem]"
            />
          </div>

          <div className="lg:pl-4">
          <EditorialTextBlock
            eyebrow="El detalle"
            title="Cada trazo deja su huella."
            body=""
          />
          </div>
        </div>
      </div>
    </section>
  )
}

export function ProcessEditorialSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-12 pt-12 md:px-10 md:pb-20 md:pt-24">
      <EditorialTextBlock
        eyebrow="El proceso"
        title="Del vidrio al color."
        body=""
        align="center"
      />

      <div className="relative mt-10 md:mt-12">
        <div className="absolute left-0 right-0 top-[7.5rem] hidden h-px bg-[#E8DED6] md:block" />

        <div className="grid gap-8 md:grid-cols-3 md:gap-5">
          {PROCESS_STEPS.map((step, index) => (
            <article
              key={step.label}
              className={`relative flex flex-col ${
                index === 1 ? 'md:pt-12' : index === 2 ? 'md:pt-24' : ''
              }`}
            >
              <div className="absolute left-0 top-0 hidden h-5 w-5 rounded-full border border-[#DFD4CA] bg-[#F7F4F0] md:block" />
              <div className="absolute left-[0.4rem] top-[0.4rem] hidden h-2.5 w-2.5 rounded-full bg-[#163F2C]/70 md:block" />

              <EditorialImage
                src={step.image}
                alt={`${step.label} del proceso artesanal de PÁTINA`}
                className="h-[20rem] md:h-[24rem]"
              />

              <div className="mx-3 mt-4 border-t border-[#E8DED6] pt-3">
                <p className="text-[8px] uppercase tracking-[0.28em] text-[#8B958F]">
                  {step.label}
                </p>
                <p className="mt-2 max-w-[18rem] text-[12px] leading-6 text-[#66736C]">
                  {step.note}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

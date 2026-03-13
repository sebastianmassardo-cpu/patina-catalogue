import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PÁTINA | Copas pintadas a mano',
  description:
    'Copas pintadas a mano, piezas únicas con identidad artística y terminación premium.',
  metadataBase: new URL('https://patinavitreal.cl'),
  openGraph: {
    title: 'PÁTINA | Copas pintadas a mano',
    description:
      'Copas pintadas a mano, piezas únicas con identidad artística y terminación premium.',
    url: 'https://patinavitreal.cl',
    siteName: 'PÁTINA',
    locale: 'es_CL',
    type: 'website',
    images: [
      {
        url: '/share-patina.png',
        width: 1200,
        height: 630,
        alt: 'PÁTINA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PÁTINA | Copas pintadas a mano',
    description:
      'Copas pintadas a mano, piezas únicas con identidad artística y terminación premium.',
    images: ['/share-patina.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}

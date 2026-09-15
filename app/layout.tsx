import './globals.css'

export const metadata = {
  title: 'BREAKTHROUGH — Stories that were never filmed',
  description: 'Premium entertainment, built for the screen.',
  icons: { icon: '/brand/breakthrough-mark.svg' },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#050505',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}

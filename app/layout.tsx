import './globals.css'

export const metadata = {
  title: 'BREAKTHROUGH — Stories that were never filmed',
  description: 'Premium entertainment, built for the screen.',
  icons: { icon: '/brand/breakthrough-mark.svg' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>
}

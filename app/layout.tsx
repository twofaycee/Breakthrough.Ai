import './globals.css'

export const metadata={title:'BREAKTHROUGH — Stories worth staying up for.',description:'Discover films and series on BREAKTHROUGH.',icons:{icon:'/brand/breakthrough-mark.svg'}}
export const viewport={width:'device-width',initialScale:1,themeColor:'#05050a'}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}

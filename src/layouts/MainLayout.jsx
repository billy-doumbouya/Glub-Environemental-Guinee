import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { SocialFloatingBar } from '../components/layout/SocialFloatingBar'
import { useScrollTop } from '../hooks/useScrollTop'

export function MainLayout({ children }) {
  useScrollTop()

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <SocialFloatingBar />
    </div>
  )
}

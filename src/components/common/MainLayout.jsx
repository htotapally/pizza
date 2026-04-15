import { Outlet } from 'react-router-dom'
import NavHeader from './NavHeader.jsx'
import Footer from './Footer.jsx'

export default function MainLayout() {
  return (
    <div className="App flex min-h-screen flex-col">
      <NavHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

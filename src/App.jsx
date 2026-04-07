import { Routes, Route, Navigate } from "react-router-dom";
import NavHeader from './components/NavHeader'
import { AuthProvider } from './context/AuthContext.jsx'
import Home from './routes/Home'
import Cart from './routes/Cart'
import Login from './routes/Login'
import ProductDetail from './routes/ProductDetail'
import Register from './routes/Register'
import Locations from './routes/Locations'
import Menu from './routes/Menu'

import { MedusaProvider } from "medusa-react"
import { QueryClient } from "@tanstack/react-query"
import { getMedusaBaseUrl } from "./utils/medusaBaseUrl.js"

const queryClient = new QueryClient()

const backendUrl = getMedusaBaseUrl()

function App() {
  return (
    <MedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl={backendUrl}
    >
      <AuthProvider>
        <div className="App min-h-screen bg-[#f8f9fa]">
          <NavHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/menu" element={<Navigate to="/menu/pizza" replace />} />
            <Route path="/menu/:categorySlug" element={<Menu />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
          </Routes>
        </div>
      </AuthProvider>
    </MedusaProvider>
  )
}

export default App

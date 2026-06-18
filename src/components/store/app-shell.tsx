'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth-store'
import { useProductStore, type Product } from '@/store/product-store'
import { useSalesStore } from '@/store/sales-store'
import { useLanguage } from '@/hooks/use-language'
import { Header } from './header'
import { Sidebar, type ViewType } from './sidebar'
import { ProductGrid } from './product-grid'
import { SalesView } from './sales-view'
import { SettingsView } from './settings-view'
import { ServicesView } from './services-view'
import { RecordSaleDialog } from './record-sale-dialog'
import { GuestMessage } from './guest-message'
import { CoffeeModal, CoffeeButton } from './coffee-modal'
import { PromotionView } from './promotion-view'

export function AppShell() {
  const { isAdmin } = useAuthStore()
  const fetchProducts = useProductStore((s) => s.fetchProducts)
  const fetchSales = useSalesStore((s) => s.fetchSales)
  const [activeView, setActiveView] = useState<ViewType>('home')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saleDialogOpen, setSaleDialogOpen] = useState(false)
  const [coffeeModalOpen, setCoffeeModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // تحميل المنتجات والمبيعات من Supabase عند mount
  useEffect(() => {
    fetchProducts()
    if (isAdmin) fetchSales()
  }, [fetchProducts, fetchSales, isAdmin])

  const handleRecordSale = (product: Product) => {
    setSelectedProduct(product)
    setSaleDialogOpen(true)
  }

  const renderContent = () => {
    switch (activeView) {
      case 'home':
        return <ProductGrid onRecordSale={handleRecordSale} />
      case 'services':
        return <ServicesView />
      case 'sales':
        return isAdmin ? <SalesView /> : null
      case 'settings':
        return isAdmin ? <SettingsView /> : null
      case 'promotion':
        return <PromotionView />
      default:
        return <ProductGrid onRecordSale={handleRecordSale} />
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1">
        <Sidebar
          activeView={activeView}
          onViewChange={setActiveView}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 overflow-auto">
          {!isAdmin && (activeView === 'home' || activeView === 'services') && <GuestMessage />}
          {renderContent()}
        </main>
      </div>

      {/* Floating Coffee Button */}
      <div className="fixed bottom-6 end-6 z-30">
        <CoffeeButton onClick={() => setCoffeeModalOpen(true)} />
      </div>

      <RecordSaleDialog
        open={saleDialogOpen}
        onOpenChange={setSaleDialogOpen}
        preselectedProduct={selectedProduct}
      />

      <CoffeeModal
        open={coffeeModalOpen}
        onOpenChange={setCoffeeModalOpen}
      />
    </div>
  )
}

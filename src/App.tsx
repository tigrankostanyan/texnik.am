import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { ServiceCatalogView } from './components/CustomerPortal/ServiceCatalogView';
import { CustomerOrdersList } from './components/CustomerPortal/CustomerOrdersList';
import { OrderTrackingView } from './components/CustomerPortal/OrderTrackingView';
import { OrderWizardModal } from './components/CustomerPortal/OrderWizardModal';
import { SpecialistOrdersView } from './components/SpecialistPortal/SpecialistOrdersView';
import { SpecialistEarningsView } from './components/SpecialistPortal/SpecialistEarningsView';
import { SpecialistScheduleBioView } from './components/SpecialistPortal/SpecialistScheduleBioView';
import { AdminOverviewView } from './components/AdminPortal/AdminOverviewView';
import { AdminServicesManagementView } from './components/AdminPortal/AdminServicesManagementView';
import { AdminOrdersMonitoringView } from './components/AdminPortal/AdminOrdersMonitoringView';
import { AdminFraudModerationView } from './components/AdminPortal/AdminFraudModerationView';
import { AdminBrandingThemeView } from './components/AdminPortal/AdminBrandingThemeView';
import { AuthModal } from './components/AuthModal';
import { SecurityCenterModal } from './components/SecurityCenterModal';
import { ServiceOffering, ServiceCategory, Order } from './types';

const MainLayout: React.FC = () => {
  const { activeRole, orders } = useApp();

  const [activeView, setActiveView] = useState<string>('catalog');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState<boolean>(false);

  // Booking wizard modal
  const [selectedServiceToBook, setSelectedServiceToBook] = useState<{
    service: ServiceOffering;
    category: ServiceCategory;
  } | null>(null);

  // Active tracking order
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);

  const handleSelectServiceToBook = (service: ServiceOffering, category: ServiceCategory) => {
    setSelectedServiceToBook({ service, category });
  };

  const handleOrderSuccess = (orderId: string) => {
    const created = orders.find((o) => o.id === orderId);
    if (created) {
      setTrackingOrder(created);
      setActiveView('order_tracking');
    } else {
      setActiveView('my_orders');
    }
  };

  const handleSelectOrderForTracking = (order: Order) => {
    setTrackingOrder(order);
    setActiveView('order_tracking');
  };

  const handleReorder = (order: Order) => {
    // Navigate to catalog
    setActiveView('catalog');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 selection:bg-blue-100">
      {/* Top Navigation */}
      <Navbar
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Customer Views */}
        {activeRole === 'customer' && (
          <>
            {activeView === 'catalog' && (
              <ServiceCatalogView onSelectServiceToBook={handleSelectServiceToBook} />
            )}
            {activeView === 'my_orders' && (
              <CustomerOrdersList
                onSelectOrder={handleSelectOrderForTracking}
                onNewOrderClick={() => setActiveView('catalog')}
                onReorder={handleReorder}
              />
            )}
            {activeView === 'order_tracking' && trackingOrder && (
              <OrderTrackingView
                order={trackingOrder}
                onBackToOrders={() => setActiveView('my_orders')}
                onReorder={handleReorder}
              />
            )}
          </>
        )}

        {/* Specialist Views */}
        {activeRole === 'specialist' && (
          <>
            {activeView === 'spec_orders' && <SpecialistOrdersView />}
            {activeView === 'spec_earnings' && <SpecialistEarningsView />}
            {activeView === 'spec_schedule' && <SpecialistScheduleBioView />}
          </>
        )}

        {/* Admin Views */}
        {activeRole === 'admin' && (
          <>
            {activeView === 'admin_overview' && (
              <AdminOverviewView onNavigateTab={(tab) => setActiveView(tab)} />
            )}
            {activeView === 'admin_services' && <AdminServicesManagementView />}
            {activeView === 'admin_orders' && <AdminOrdersMonitoringView />}
            {activeView === 'admin_fraud' && <AdminFraudModerationView />}
            {activeView === 'admin_branding' && <AdminBrandingThemeView />}
          </>
        )}
      </main>

      {/* Booking Wizard Modal */}
      {selectedServiceToBook && (
        <OrderWizardModal
          service={selectedServiceToBook.service}
          category={selectedServiceToBook.category}
          isOpen={!!selectedServiceToBook}
          onClose={() => setSelectedServiceToBook(null)}
          onOrderSuccess={handleOrderSuccess}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Security Center Modal */}
      <SecurityCenterModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

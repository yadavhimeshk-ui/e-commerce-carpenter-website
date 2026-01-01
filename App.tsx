import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Login } from './components/Login';
import { HomePage } from './components/HomePage';
import { ProductList } from './components/ProductList';
import { ProductDetail } from './components/ProductDetail';
import { AboutUs } from './components/AboutUs';
import { AdminDashboard } from './components/admin/AdminDashboard';

function AppContent() {
  const { user, userType, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user && currentPage === 'admin') {
    setCurrentPage('login');
  }

  if (userType === 'owner' && currentPage === 'login') {
    setCurrentPage('admin');
  }

  if (userType === 'customer' && currentPage === 'login') {
    setCurrentPage('home');
  }

  const handleNavigate = (page: string) => {
    if (page === 'admin' && userType !== 'owner') {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
    setSelectedProduct(null);
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
  };

  const handleLoginSuccess = () => {
    if (userType === 'owner') {
      setCurrentPage('admin');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLoginRequired = () => {
    setCurrentPage('login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage !== 'login' && (
        <Header onNavigate={handleNavigate} currentPage={currentPage} />
      )}

      {currentPage === 'login' && (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}

      {currentPage === 'home' && (
        <HomePage onNavigate={handleNavigate} />
      )}

      {currentPage === 'products' && (
        <ProductList onProductSelect={handleProductSelect} />
      )}

      {currentPage === 'about' && (
        <AboutUs />
      )}

      {currentPage === 'admin' && userType === 'owner' && (
        <AdminDashboard />
      )}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onLoginRequired={handleLoginRequired}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

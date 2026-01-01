import { useState, useEffect } from 'react';
import { Menu, X, LogOut, User, ShoppingCart, Home, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, userType, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    fetchBannerImages();
  }, []);

  useEffect(() => {
    if (bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bannerImages]);

  const fetchBannerImages = async () => {
    const { data } = await supabase
      .from('gallery_images')
      .select('image_url')
      .eq('category', 'banner')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setBannerImages(data.map(img => img.image_url));
    }
  };

  const handleSignOut = () => {
    signOut();
    onNavigate('home');
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold tracking-wide">SHREE HARDWARE</h1>
              <p className="text-sm md:text-base mt-1 text-blue-100">Your Trusted Carpenter & Hardware Shop</p>
            </div>

            {user && (
              <div className="hidden md:flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-blue-100">Welcome,</p>
                  <p className="font-semibold">{userType === 'owner' ? 'Owner' : user.name || 'Customer'}</p>
                </div>
                <User className="w-8 h-8 p-1 bg-blue-700 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>

      {bannerImages.length > 0 && (
        <div className="relative h-48 md:h-72 overflow-hidden bg-gray-200">
          {bannerImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {bannerImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBannerIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentBannerIndex ? 'bg-white w-6' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="hidden md:flex space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                  currentPage === 'home'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={() => onNavigate('products')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                  currentPage === 'products'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Products
              </button>
              <button
                onClick={() => onNavigate('about')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                  currentPage === 'about'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Info className="w-5 h-5" />
                About Us
              </button>
              {userType === 'owner' && (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${
                    currentPage === 'admin'
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Admin Dashboard
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="hidden md:block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <button
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Home className="w-5 h-5" />
                Home
              </button>
              <button
                onClick={() => {
                  onNavigate('products');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <ShoppingCart className="w-5 h-5" />
                Products
              </button>
              <button
                onClick={() => {
                  onNavigate('about');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                <Info className="w-5 h-5" />
                About Us
              </button>
              {userType === 'owner' && (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Admin Dashboard
                </button>
              )}
              {user ? (
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    onNavigate('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Sign In
                </button>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

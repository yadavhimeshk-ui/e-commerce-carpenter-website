import { useState } from 'react';
import { Package, ShoppingBag, Users, MapPin, Image, Info, FileDown } from 'lucide-react';
import { ProductManagement } from './ProductManagement';
import { OrderManagement } from './OrderManagement';
import { CustomerManagement } from './CustomerManagement';
import { ShopSettings } from './ShopSettings';
import { GalleryManagement } from './GalleryManagement';
import { AboutUsManagement } from './AboutUsManagement';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');

  const tabs = [
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'shop', label: 'Shop Details', icon: MapPin },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'about', label: 'About Us', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your shop, products, and orders</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b overflow-x-auto">
            <div className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'products' && <ProductManagement />}
            {activeTab === 'orders' && <OrderManagement />}
            {activeTab === 'customers' && <CustomerManagement />}
            {activeTab === 'shop' && <ShopSettings />}
            {activeTab === 'gallery' && <GalleryManagement />}
            {activeTab === 'about' && <AboutUsManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}

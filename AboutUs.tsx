import { useEffect, useState } from 'react';
import { Phone, Mail, MapPin, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function AboutUs() {
  const [aboutUs, setAboutUs] = useState<any>(null);
  const [shopDetails, setShopDetails] = useState<any>(null);
  const [shopImages, setShopImages] = useState<string[]>([]);
  const [workImages, setWorkImages] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: about } = await supabase
      .from('about_us')
      .select('*')
      .maybeSingle();

    const { data: shop } = await supabase
      .from('shop_details')
      .select('*')
      .maybeSingle();

    const { data: shopImgs } = await supabase
      .from('gallery_images')
      .select('image_url')
      .eq('category', 'shop');

    const { data: workImgs } = await supabase
      .from('gallery_images')
      .select('image_url')
      .eq('category', 'work');

    if (about) setAboutUs(about);
    if (shop) setShopDetails(shop);
    if (shopImgs) setShopImages(shopImgs.map(img => img.image_url));
    if (workImgs) setWorkImages(workImgs.map(img => img.image_url));
  };

  const openGoogleMaps = () => {
    if (shopDetails?.latitude && shopDetails?.longitude) {
      window.open(
        `https://www.google.com/maps?q=${shopDetails.latitude},${shopDetails.longitude}`,
        '_blank'
      );
    } else if (shopDetails?.address) {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopDetails.address)}`,
        '_blank'
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Shree Hardware</h1>
          <p className="text-xl text-blue-100">
            Your trusted partner in quality carpentry and hardware
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {aboutUs && (aboutUs.description || aboutUs.experience) ? (
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-md p-8">
              {aboutUs.description && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Who We Are</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{aboutUs.description}</p>
                </div>
              )}

              {aboutUs.experience && (
                <div className="bg-blue-50 rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Experience</h2>
                  <p className="text-blue-700 text-lg leading-relaxed">{aboutUs.experience}</p>
                </div>
              )}
            </div>
          </section>
        ) : (
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">Information not available yet.</p>
            </div>
          </section>
        )}

        {(shopImages.length > 0 || workImages.length > 0) && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Gallery</h2>

            {shopImages.length > 0 && (
              <div className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-semibold text-gray-800">Our Shop</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {shopImages.map((img, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md">
                      <img
                        src={img}
                        alt={`Shop ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {workImages.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <ImageIcon className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-semibold text-gray-800">Our Work</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {workImages.map((img, index) => (
                    <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md">
                      <img
                        src={img}
                        alt={`Work ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aboutUs && (aboutUs.contact_phone || aboutUs.contact_email || aboutUs.contact_address) && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Get in Touch</h3>
                <div className="space-y-4">
                  {aboutUs.contact_phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="text-gray-800 font-medium">{aboutUs.contact_phone}</p>
                      </div>
                    </div>
                  )}
                  {aboutUs.contact_email && (
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-gray-800 font-medium">{aboutUs.contact_email}</p>
                      </div>
                    </div>
                  )}
                  {aboutUs.contact_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="text-gray-800 font-medium">{aboutUs.contact_address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {shopDetails && shopDetails.address && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Visit Our Shop</h3>
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="text-gray-800 font-medium">{shopDetails.address}</p>
                  </div>
                </div>
                <button
                  onClick={openGoogleMaps}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  <MapPin className="w-5 h-5" />
                  Open in Google Maps
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

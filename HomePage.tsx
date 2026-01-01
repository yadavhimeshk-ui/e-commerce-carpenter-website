import { useEffect, useState } from 'react';
import { MapPin, Phone, Mail, Image as ImageIcon, Video, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [shopDetails, setShopDetails] = useState<any>(null);
  const [shopImages, setShopImages] = useState<string[]>([]);
  const [workImages, setWorkImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [aboutUs, setAboutUs] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: shop } = await supabase
      .from('shop_details')
      .select('*')
      .maybeSingle();

    const { data: shopImgs } = await supabase
      .from('gallery_images')
      .select('image_url')
      .eq('category', 'shop')
      .limit(6);

    const { data: workImgs } = await supabase
      .from('gallery_images')
      .select('image_url')
      .eq('category', 'work')
      .limit(6);

    const { data: vids } = await supabase
      .from('gallery_videos')
      .select('*')
      .limit(4);

    const { data: about } = await supabase
      .from('about_us')
      .select('*')
      .maybeSingle();

    if (shop) setShopDetails(shop);
    if (shopImgs) setShopImages(shopImgs.map(img => img.image_url));
    if (workImgs) setWorkImages(workImgs.map(img => img.image_url));
    if (vids) setVideos(vids);
    if (about) setAboutUs(about);
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Welcome to Shree Hardware</h1>
          <p className="text-xl text-blue-100 mb-8">
            Your trusted partner for quality carpentry and hardware solutions
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors font-semibold"
          >
            Browse Products
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {aboutUs && (aboutUs.description || aboutUs.experience) && (
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">About Us</h2>
              {aboutUs.description && (
                <p className="text-gray-700 text-lg leading-relaxed mb-4">{aboutUs.description}</p>
              )}
              {aboutUs.experience && (
                <div className="bg-blue-50 rounded-md p-6 mt-4">
                  <h3 className="font-semibold text-blue-800 mb-2">Our Experience</h3>
                  <p className="text-blue-700">{aboutUs.experience}</p>
                </div>
              )}
              <div className="text-center mt-6">
                <button
                  onClick={() => onNavigate('about')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Learn More About Us →
                </button>
              </div>
            </div>
          </section>
        )}

        {shopImages.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Our Shop</h2>
                <p className="text-gray-600 mt-1">Take a look at our facilities</p>
              </div>
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          </section>
        )}

        {workImages.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Our Work</h2>
                <p className="text-gray-600 mt-1">Quality craftsmanship you can trust</p>
              </div>
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          </section>
        )}

        {videos.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Video Gallery</h2>
                <p className="text-gray-600 mt-1">Watch our work in action</p>
              </div>
              <Video className="w-8 h-8 text-blue-600" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videos.map((video, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {video.title || `Video ${index + 1}`}
                  </h3>
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    Watch Video
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {shopDetails && shopDetails.address && (
          <section className="mb-16">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Visit Us</h2>
              <div className="flex flex-col items-center">
                <div className="flex items-start gap-3 mb-6">
                  <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700 text-lg">{shopDetails.address}</p>
                </div>
                <button
                  onClick={openGoogleMaps}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                >
                  <MapPin className="w-5 h-5" />
                  Open in Google Maps
                </button>
              </div>
            </div>
          </section>
        )}

        {aboutUs && (aboutUs.contact_phone || aboutUs.contact_email) && (
          <section>
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg shadow-md p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>
              <div className="flex flex-col md:flex-row justify-center gap-8">
                {aboutUs.contact_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-6 h-6" />
                    <div>
                      <p className="text-sm text-blue-100">Phone</p>
                      <p className="font-semibold text-lg">{aboutUs.contact_phone}</p>
                    </div>
                  </div>
                )}
                {aboutUs.contact_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-6 h-6" />
                    <div>
                      <p className="text-sm text-blue-100">Email</p>
                      <p className="font-semibold text-lg">{aboutUs.contact_email}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

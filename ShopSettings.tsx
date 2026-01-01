import { useState, useEffect } from 'react';
import { MapPin, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function ShopSettings() {
  const [formData, setFormData] = useState({
    address: '',
    latitude: '',
    longitude: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shopId, setShopId] = useState<string | null>(null);

  useEffect(() => {
    fetchShopDetails();
  }, []);

  const fetchShopDetails = async () => {
    const { data } = await supabase
      .from('shop_details')
      .select('*')
      .maybeSingle();

    if (data) {
      setShopId(data.id);
      setFormData({
        address: data.address || '',
        latitude: data.latitude?.toString() || '',
        longitude: data.longitude?.toString() || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const updateData = {
      address: formData.address,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      updated_at: new Date().toISOString(),
    };

    if (shopId) {
      const { error } = await supabase
        .from('shop_details')
        .update(updateData)
        .eq('id', shopId);

      if (!error) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } else {
      const { data, error } = await supabase
        .from('shop_details')
        .insert([updateData])
        .select()
        .single();

      if (!error && data) {
        setShopId(data.id);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Shop Details & Location</h2>

      <div className="bg-white border rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shop Address *
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              rows={4}
              placeholder="Enter complete shop address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              This address will be shown to customers and used for Google Maps integration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude (Optional)
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                placeholder="e.g., 28.6139"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude (Optional)
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                placeholder="e.g., 77.2090"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h4 className="font-medium text-blue-800 mb-2">How to find coordinates:</h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Open Google Maps</li>
              <li>Right-click on your shop location</li>
              <li>Click on the coordinates to copy them</li>
              <li>Paste the latitude and longitude values here</li>
            </ol>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-700 font-medium">Shop details saved successfully!</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Shop Details'}
          </button>
        </form>

        {formData.address && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-gray-800 mb-2">Preview</h3>
            <div className="bg-gray-50 rounded-md p-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-gray-700">{formData.address}</p>
              </div>
              {formData.latitude && formData.longitude && (
                <p className="text-xs text-gray-500 mt-2">
                  Coordinates: {formData.latitude}, {formData.longitude}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, Video } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function GalleryManagement() {
  const [images, setImages] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');
  const [imageUrl, setImageUrl] = useState('');
  const [imageCategory, setImageCategory] = useState<'banner' | 'shop' | 'work'>('shop');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    const { data: imagesData } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false });

    const { data: videosData } = await supabase
      .from('gallery_videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (imagesData) setImages(imagesData);
    if (videosData) setVideos(videosData);
  };

  const handleAddImage = async () => {
    if (!imageUrl.trim()) return;

    await supabase
      .from('gallery_images')
      .insert([{ image_url: imageUrl, category: imageCategory }]);

    setImageUrl('');
    await fetchGalleryItems();
  };

  const handleAddVideo = async () => {
    if (!videoUrl.trim()) return;

    await supabase
      .from('gallery_videos')
      .insert([{ video_url: videoUrl, title: videoTitle }]);

    setVideoUrl('');
    setVideoTitle('');
    await fetchGalleryItems();
  };

  const handleDeleteImage = async (id: string) => {
    if (confirm('Are you sure you want to delete this image?')) {
      await supabase.from('gallery_images').delete().eq('id', id);
      await fetchGalleryItems();
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      await supabase.from('gallery_videos').delete().eq('id', id);
      await fetchGalleryItems();
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Gallery Management</h2>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('images')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'images'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          Images ({images.length})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'videos'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Video className="w-5 h-5" />
          Videos ({videos.length})
        </button>
      </div>

      {activeTab === 'images' ? (
        <div>
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Add New Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Category *
                </label>
                <select
                  value={imageCategory}
                  onChange={(e) => setImageCategory(e.target.value as 'banner' | 'shop' | 'work')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="banner">Banner (Homepage Slideshow)</option>
                  <option value="shop">Shop Images</option>
                  <option value="work">Completed Work</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {['banner', 'shop', 'work'].map((category) => {
              const categoryImages = images.filter((img) => img.category === category);
              if (categoryImages.length === 0) return null;

              return (
                <div key={category}>
                  <h3 className="font-semibold text-gray-800 mb-3 capitalize">
                    {category === 'banner' ? 'Banner Images' : category === 'shop' ? 'Shop Images' : 'Completed Work'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {categoryImages.map((image) => (
                      <div key={image.id} className="relative group">
                        <img
                          src={image.image_url}
                          alt="Gallery"
                          className="w-full h-48 object-cover rounded-lg border"
                        />
                        <button
                          onClick={() => handleDeleteImage(image.id)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {images.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No images added yet.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="bg-white border rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4">Add New Video</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Title
                </label>
                <input
                  type="text"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter video title (optional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL *
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleAddVideo}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <Plus className="w-5 h-5" />
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-gray-800">{video.title || 'Untitled Video'}</h4>
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    {video.video_url}
                  </a>
                </div>
                <button
                  onClick={() => handleDeleteVideo(video.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}

            {videos.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-500">No videos added yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

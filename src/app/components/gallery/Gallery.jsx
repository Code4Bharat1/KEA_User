'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter,
  Upload,
  Heart,
  MessageCircle,
  Share2,
  X,
  Plus,
  Image as ImageIcon,
  Calendar,
  MapPin,
  Eye
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function Gallery() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All photos');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('All years');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState('');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: '',
    imageUrl: '',
    tags: '',
    eventDate: '',
    location: ''
  });

  const years = ['All years', '2025', '2024', '2023', '2022', '2021'];

  useEffect(() => {
    fetchUserData();
    fetchGallery();
    fetchCategories();
  }, [selectedCategory, searchQuery, selectedYear, currentPage]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All photos') params.append('category', selectedCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (selectedYear !== 'All years') params.append('year', selectedYear);
      params.append('page', currentPage);
      params.append('limit', 12);

      const { data } = await axios.get(`${API_URL}/gallery?${params.toString()}`);
      setItems(data.items || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/gallery/categories/stats`);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      const itemData = {
        ...newItem,
        tags: newItem.tags
      };

      await axios.post(`${API_URL}/gallery`, itemData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowUploadModal(false);
      resetForm();
      fetchGallery();
      alert('Image uploaded successfully! Pending approval.');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewItem({
      title: '',
      description: '',
      category: '',
      imageUrl: '',
      tags: '',
      eventDate: '',
      location: ''
    });
  };

  const handleLike = async (itemId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/gallery/${itemId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state
      if (selectedItem && selectedItem._id === itemId) {
        const { data } = await axios.get(`${API_URL}/gallery/${itemId}`);
        setSelectedItem(data);
      }
      fetchGallery();
    } catch (error) {
      alert('Failed to like image');
    }
  };

  const handleComment = async (itemId) => {
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem('userToken');
      const { data } = await axios.post(`${API_URL}/gallery/${itemId}/comment`, 
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      setComment('');
      setSelectedItem(data);
    } catch (error) {
      alert('Failed to post comment');
    }
  };

  const openDetail = async (item) => {
    try {
      const { data } = await axios.get(`${API_URL}/gallery/${item._id}`);
      setSelectedItem(data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 text-black z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900">Upload Photo</h2>
                <button onClick={() => setShowUploadModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleUpload} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    required
                    value={newItem.title}
                    onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                    placeholder="e.g., Annual Conference 2024"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select category</option>
                    <option value="Event Category">Event Category</option>
                    <option value="Project Showcase">Project Showcase</option>
                    <option value="Member Activities">Member Activities</option>
                    <option value="Good Wishes">Good Wishes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                  <input
                    type="url"
                    required
                    value={newItem.imageUrl}
                    onChange={(e) => setNewItem({...newItem, imageUrl: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter a direct link to the image</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    rows={3}
                    placeholder="Describe this photo..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Date</label>
                    <input
                      type="date"
                      value={newItem.eventDate}
                      onChange={(e) => setNewItem({...newItem, eventDate: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={newItem.location}
                      onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                      placeholder="e.g., Mumbai, India"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newItem.tags}
                    onChange={(e) => setNewItem({...newItem, tags: e.target.value})}
                    placeholder="e.g., conference, workshop, networking"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Upload Photo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {showDetailModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full h-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-semibold">{selectedItem.title}</h2>
                <button 
                  onClick={() => setShowDetailModal(false)} 
                  className="p-2 hover:bg-white/10 rounded-lg text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden">
                {/* Image */}
                <div className="lg:col-span-2 flex items-center justify-center bg-black rounded-lg overflow-hidden">
                  <img
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>

                {/* Details Sidebar */}
                <div className="bg-white rounded-lg p-6 overflow-y-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {selectedItem.uploadedBy?.name || 'Anonymous'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {getTimeAgo(selectedItem.createdAt)}
                      </p>
                    </div>
                  </div>

                  {selectedItem.description && (
                    <p className="text-gray-700 mb-4">{selectedItem.description}</p>
                  )}

                  {selectedItem.eventDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedItem.eventDate).toLocaleDateString()}</span>
                    </div>
                  )}

                  {selectedItem.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{selectedItem.location}</span>
                    </div>
                  )}

                  {selectedItem.tags && selectedItem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedItem.tags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mb-6 pb-6 border-b border-gray-200">
                    <button
                      onClick={() => handleLike(selectedItem._id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                        selectedItem.likes?.includes(user?._id)
                          ? 'bg-red-50 text-red-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${selectedItem.likes?.includes(user?._id) ? 'fill-current' : ''}`} />
                      <span>{selectedItem.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>

                  {/* Comments */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">
                      Comments ({selectedItem.comments?.length || 0})
                    </h3>

                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                      {selectedItem.comments?.map((comment, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 bg-gray-50 rounded-lg p-2">
                            <p className="text-sm font-medium text-gray-900">
                              {comment.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {getTimeAgo(comment.createdAt)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(selectedItem._id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleComment(selectedItem._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Gallery / Good Wishes</h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Browse photos from our events and celebrations
                  </p>
                </div>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-medium"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload</span>
                </button>
              </div>

              {/* Filters */}
              <div className="bg-white rounded-lg border text-black border-gray-200 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search photos by event type, year, etc"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>

                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name} ({cat.count})
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-sm text-gray-600">
                  Showing {items.length} photos | Filtered by: {selectedCategory} - All categories - All years
                </p>
              </div>
            </div>

            {/* Photo Grid */}
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <ImageIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No photos found</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Upload First Photo
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Photo grid</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {items.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => openDetail(item)}
                      className="group relative aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-medium text-sm mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-3 text-white text-xs">
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {item.likes?.length || 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" />
                              {item.comments?.length || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {[...Array(Math.min(7, totalPages))].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-10 h-10 rounded-lg ${
                          currentPage === i + 1
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
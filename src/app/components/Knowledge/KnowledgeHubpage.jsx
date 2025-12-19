'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  FileText, 
  Video, 
  Link2, 
  Image, 
  X, 
  Plus, 
  Upload, 
  Loader, 
  ArrowLeft 
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function KnowledgeHub() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All resources');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [resources, setResources] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [uploadType, setUploadType] = useState('link');

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [newResource, setNewResource] = useState({
    title: '',
    category: '',
    format: '',
    tags: '',
    link: '',
    description: '',
    author: ''
  });

  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchResources();
    fetchCategories();
  }, [selectedCategory, searchQuery, currentPage]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All resources') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      params.append('page', currentPage);
      params.append('limit', 9);

      const { data } = await axios.get(`${API_URL}/resources?${params.toString()}`);
      setResources(data.resources);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/resources/categories/stats`);
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCreateResource = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const token = localStorage.getItem('userToken');

    const resourceData = {
      ...newResource,
      tags: Array.isArray(newResource.tags)
        ? newResource.tags
        : typeof newResource.tags === 'string'
        ? newResource.tags.split(',').map(tag => tag.trim()).filter(Boolean)
        : []
    };

    await axios.post(`${API_URL}/resources/`, resourceData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setShowCreateModal(false);
    resetForm();
    fetchResources();
    fetchCategories();
    alert('Resource created successfully!');
  } catch (error) {
    alert(error.response?.data?.message || 'Failed to create resource');
  } finally {
    setLoading(false);
  }
};


  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    setLoading(true);
    const formData = new FormData();

    formData.append('file', file);
    formData.append('title', newResource.title);
    formData.append('category', newResource.category);
    formData.append('tags', newResource.tags);
    formData.append('description', newResource.description);
    formData.append('author', newResource.author);

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/resources/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        }
      });

      setShowCreateModal(false);
      resetForm();
      fetchResources();
      fetchCategories();
      alert('File uploaded successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewResource({
      title: '',
      category: '',
      format: '',
      tags: '',
      link: '',
      description: '',
      author: ''
    });
    setFile(null);
  };

  const handleResourceClick = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const getIconComponent = (format) => {
    const icons = {
      'PDF': FileText,
      'DOCX': FileText,
      'Video': Video,
      'Link': Link2,
      'Images': Image
    };
    return icons[format] || FileText;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        {/* Create Resource Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Create New Resource</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-6 pt-4">
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadType('link')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                      uploadType === 'link' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Add Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadType('file')}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium ${
                      uploadType === 'file' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              <form onSubmit={uploadType === 'link' ? handleCreateResource : handleFileUpload} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="e.g., Bridge Design Checklist"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={newResource.category}
                      onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      <option value="Career guidance">Career guidance</option>
                      <option value="Technical papers">Technical papers</option>
                      <option value="Project reports">Project reports</option>
                      <option value="Workshop & webinars">Workshop & webinars</option>
                      <option value="Templates & checklists">Templates & checklists</option>
                    </select>
                  </div>

                  {uploadType === 'link' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Format *
                      </label>
                      <select
                        required
                        value={newResource.format}
                        onChange={(e) => setNewResource({...newResource, format: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select format</option>
                        <option value="PDF">PDF</option>
                        <option value="DOCX">DOCX</option>
                        <option value="Video">Video</option>
                        <option value="Link">Link</option>
                        <option value="Images">Images</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={newResource.author}
                      onChange={(e) => setNewResource({...newResource, author: e.target.value})}
                      placeholder="Your name or organization"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={newResource.tags}
                    onChange={(e) => setNewResource({...newResource, tags: e.target.value})}
                    placeholder="e.g., Template, Civil, Guide"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {uploadType === 'link' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resource Link/URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={newResource.link}
                      onChange={(e) => setNewResource({...newResource, link: e.target.value})}
                      placeholder="https://example.com/resource"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File *
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        required
                        onChange={(e) => setFile(e.target.files[0])}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        accept=".pdf,.docx,.doc,.mp4,.jpg,.jpeg,.png"
                      />
                      <Upload className="w-5 h-5 text-gray-400" />
                    </div>
                    {file && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newResource.description}
                    onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                    placeholder="Brief description of the resource..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    {uploadType === 'link' ? 'Create Resource' : 'Upload File'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Knowledge Hub</h1>
                <p className="text-gray-600 mt-1">
                  Search and browse curated engineering resources from the KEA community
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Create Resource
                </button>
                <span className="text-sm font-medium text-blue-600">
                  {categories.find(c => c.name === 'All resources')?.count || 0} resources
                </span>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources, topics, authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex gap-6">
              {/* Sidebar */}
              <aside className="w-64 flex-shrink-0">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === cat.name
                            ? 'bg-blue-50 text-blue-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        <span className="text-gray-500">{cat.count}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Resources Grid */}
              <main className="flex-1">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Resources</h2>
                    <p className="text-sm text-gray-500">
                      {loading ? 'Loading...' : `Showing ${resources.length} results`}
                    </p>
                  </div>
                  
                  {loading ? (
                    <div className="p-12 flex items-center justify-center">
                      <Loader className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : resources.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      No resources found. Create one to get started!
                    </div>
                  ) : (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resources.map((resource) => {
                        const Icon = getIconComponent(resource.format);
                        return (
                          <div
                            key={resource._id}
                            onClick={() => handleResourceClick(resource.link)}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors">
                                <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2">
                                  {resource.title}
                                </h3>
                                <p className="text-xs text-gray-500">{resource.format}</p>
                              </div>
                            </div>
                            
                            {resource.tags && resource.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {resource.tags.map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="truncate">{resource.author || 'Anonymous'}</span>
                              <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {!loading && resources.length > 0 && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
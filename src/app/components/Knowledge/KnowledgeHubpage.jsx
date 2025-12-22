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
  ArrowLeft,
  Filter,
  ChevronDown
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
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
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
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Create New Resource</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-4 sm:px-6 pt-4">
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setUploadType('link')}
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
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
                    className={`flex-1 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      uploadType === 'file' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Upload File
                  </button>
                </div>
              </div>

              <form onSubmit={uploadType === 'link' ? handleCreateResource : handleFileUpload} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resource Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newResource.title}
                    onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                    placeholder="e.g., Bridge Design Checklist"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newResource.category}
                      onChange={(e) => setNewResource({...newResource, category: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                        Format <span className="text-red-500">*</span>
                      </label>
                      <select
                        required
                        value={newResource.format}
                        onChange={(e) => setNewResource({...newResource, format: e.target.value})}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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

                  <div className={uploadType === 'link' ? '' : 'sm:col-span-2'}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author
                    </label>
                    <input
                      type="text"
                      value={newResource.author}
                      onChange={(e) => setNewResource({...newResource, author: e.target.value})}
                      placeholder="Your name or organization"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>

                {uploadType === 'link' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resource Link/URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={newResource.link}
                      onChange={(e) => setNewResource({...newResource, link: e.target.value})}
                      placeholder="https://example.com/resource"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload File <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        required
                        onChange={(e) => setFile(e.target.files[0])}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept=".pdf,.docx,.doc,.mp4,.jpg,.jpeg,.png"
                      />
                      <Upload className="w-5 h-5 text-gray-400 flex-shrink-0" />
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                  >
                    {loading && <Loader className="w-4 h-4 animate-spin" />}
                    {uploadType === 'link' ? 'Create Resource' : 'Upload File'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Category Filter */}
        {showCategoryFilter && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setShowCategoryFilter(false)}>
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between rounded-t-2xl">
                <h3 className="font-semibold text-gray-900">Filter by Category</h3>
                <button onClick={() => setShowCategoryFilter(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4 space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setCurrentPage(1);
                      setShowCategoryFilter(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors ${
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
          </div>
        )}

        {/* Main Content */}
        <div className="p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Knowledge Hub</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1">
                    Search and browse curated engineering resources
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Create Resource</span>
                    <span className="sm:hidden">Create</span>
                  </button>
                  <span className="text-sm font-medium text-blue-600 whitespace-nowrap">
                    {categories.find(c => c.name === 'All resources')?.count || 0} resources
                  </span>
                </div>
              </div>
            </div>

            {/* Search & Mobile Filter */}
            <div className="mb-6 flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <button
                onClick={() => setShowCategoryFilter(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-5 h-5" />
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Selected Category */}
            <div className="lg:hidden mb-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                <span>{selectedCategory}</span>
                <span className="text-blue-500">•</span>
                <span>{categories.find(c => c.name === selectedCategory)?.count || 0}</span>
              </div>
            </div>

            {/* Content */}
            <div className="flex gap-6">
              {/* Desktop Sidebar */}
              <aside className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-24">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setCurrentPage(1);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
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
              <main className="flex-1 min-w-0">
                <div className="bg-white rounded-xl border border-gray-200">
                  <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
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
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="font-medium mb-1">No resources found</p>
                      <p className="text-sm">Create one to get started!</p>
                    </div>
                  ) : (
                    <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resources.map((resource) => {
                        const Icon = getIconComponent(resource.format);
                        return (
                          <div
                            key={resource._id}
                            onClick={() => handleResourceClick(resource.link)}
                            className="border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group"
                          >
                            <div className="flex items-start gap-3 mb-3">
                              <div className="p-2.5 bg-gray-100 rounded-lg group-hover:bg-blue-50 transition-colors flex-shrink-0">
                                <Icon className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-gray-900 mb-1 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                                  {resource.title}
                                </h3>
                                <p className="text-xs text-gray-500">{resource.format}</p>
                              </div>
                            </div>
                            
                            {resource.tags && resource.tags.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-3">
                                {resource.tags.slice(0, 3).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {resource.tags.length > 3 && (
                                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md">
                                    +{resource.tags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="truncate flex-1 mr-2">{resource.author || 'Anonymous'}</span>
                              <span className="flex-shrink-0">{new Date(resource.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Pagination */}
                  {!loading && resources.length > 0 && totalPages > 1 && (
                    <div className="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  ExternalLink, 
  Eye,
  Grid,
  List,
  X,
  Plus,
  Loader,
  Filter
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function ToolsLibrary() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categorySidebarOpen, setCategorySidebarOpen] = useState(false);
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All tools');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [newTool, setNewTool] = useState({
    name: '',
    category: '',
    subcategory: '',
    description: '',
    version: '',
    platform: '',
    license: '',
    downloadLink: '',
    documentationLink: '',
    features: '',
    requirements: '',
    fileSize: '',
    rating: 0
  });

  useEffect(() => {
    fetchUserData();
    fetchTools();
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
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'All tools') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      params.append('page', currentPage);
      params.append('limit', 12);

      const { data } = await axios.get(`${API_URL}/tools?${params.toString()}`);
      setTools(data.tools);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setTools([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tools/categories/stats`);
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddTool = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      const toolData = {
        ...newTool,
        features: newTool.features.split(',').map(f => f.trim()).filter(Boolean),
        requirements: newTool.requirements.split(',').map(r => r.trim()).filter(Boolean)
      };

      await axios.post(`${API_URL}/tools`, toolData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setShowAddModal(false);
      resetForm();
      fetchTools();
      fetchCategories();
      alert('Tool added successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add tool');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewTool({
      name: '',
      category: '',
      subcategory: '',
      description: '',
      version: '',
      platform: '',
      license: '',
      downloadLink: '',
      documentationLink: '',
      features: '',
      requirements: '',
      fileSize: '',
      rating: 0
    });
  };

  const handleToolClick = (tool) => {
    setSelectedTool(tool);
  };

  const handleDownload = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        {/* Add Tool Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 text-black z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900">Add New Tool</h2>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddTool} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tool Name *</label>
                    <input
                      type="text"
                      required
                      value={newTool.name}
                      onChange={(e) => setNewTool({...newTool, name: e.target.value})}
                      placeholder="e.g., AutoCAD"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={newTool.category}
                      onChange={(e) => setNewTool({...newTool, category: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      <option value="Tools & Software Library">Tools & Software Library</option>
                      <option value="Design & CAD software">Design & CAD software</option>
                      <option value="Structural analysis">Structural analysis</option>
                      <option value="Mechanical">Mechanical</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Project & planning">Project & planning</option>
                      <option value="Site tools">Site tools</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Version</label>
                    <input
                      type="text"
                      value={newTool.version}
                      onChange={(e) => setNewTool({...newTool, version: e.target.value})}
                      placeholder="e.g., 2024"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                    <select
                      value={newTool.platform}
                      onChange={(e) => setNewTool({...newTool, platform: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select platform</option>
                      <option value="Windows">Windows</option>
                      <option value="Mac">Mac</option>
                      <option value="Linux">Linux</option>
                      <option value="Web">Web</option>
                      <option value="Cross-platform">Cross-platform</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">License</label>
                    <select
                      value={newTool.license}
                      onChange={(e) => setNewTool({...newTool, license: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select license</option>
                      <option value="Free">Free</option>
                      <option value="Open Source">Open Source</option>
                      <option value="Freemium">Freemium</option>
                      <option value="Paid">Paid</option>
                      <option value="Trial">Trial</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">File Size</label>
                    <input
                      type="text"
                      value={newTool.fileSize}
                      onChange={(e) => setNewTool({...newTool, fileSize: e.target.value})}
                      placeholder="e.g., 2.5 GB"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={newTool.description}
                    onChange={(e) => setNewTool({...newTool, description: e.target.value})}
                    placeholder="Brief description of the tool..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma separated)</label>
                  <input
                    type="text"
                    value={newTool.features}
                    onChange={(e) => setNewTool({...newTool, features: e.target.value})}
                    placeholder="e.g., 3D modeling, Rendering, Animation"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (comma separated)</label>
                  <input
                    type="text"
                    value={newTool.requirements}
                    onChange={(e) => setNewTool({...newTool, requirements: e.target.value})}
                    placeholder="e.g., Windows 10, 8GB RAM, Graphics card"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Download Link</label>
                    <input
                      type="url"
                      value={newTool.downloadLink}
                      onChange={(e) => setNewTool({...newTool, downloadLink: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Documentation Link</label>
                    <input
                      type="url"
                      value={newTool.documentationLink}
                      onChange={(e) => setNewTool({...newTool, documentationLink: e.target.value})}
                      placeholder="https://..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Tool'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tool Details Modal */}
        {selectedTool && (
          <div className="fixed inset-0 bg-black/50 text-black z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-900">{selectedTool.name}</h2>
                <button onClick={() => setSelectedTool(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600">{selectedTool.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Version</h3>
                    <p className="text-gray-600">{selectedTool.version || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Platform</h3>
                    <p className="text-gray-600">{selectedTool.platform || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">License</h3>
                    <p className="text-gray-600">{selectedTool.license || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">File Size</h3>
                    <p className="text-gray-600">{selectedTool.fileSize || 'N/A'}</p>
                  </div>
                </div>

                {selectedTool.features && selectedTool.features.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Key Features</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedTool.features.map((feature, idx) => (
                        <li key={idx} className="text-gray-600">{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedTool.requirements && selectedTool.requirements.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">System Requirements</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedTool.requirements.map((req, idx) => (
                        <li key={idx} className="text-gray-600">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  {selectedTool.downloadLink && (
                    <button
                      onClick={() => handleDownload(selectedTool.downloadLink)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download tool
                    </button>
                  )}
                  {selectedTool.documentationLink && (
                    <button
                      onClick={() => handleDownload(selectedTool.documentationLink)}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Documentation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Tools & Software Library</h1>
                  <p className="text-sm text-gray-600 mt-1">Engineering software, design tools, and calculators</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Tool</span>
                  </button>
                  <span className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium whitespace-nowrap">
                    {categories.find(c => c.name === 'All tools')?.count || 0} tools
                  </span>
                </div>
              </div>

              {/* Search and View Toggle */}
              <div className="flex gap-3">
                <div className="flex-1 text-black relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tools, software, and calculators"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => setCategorySidebarOpen(true)}
                  className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <Filter className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="flex gap-6">
              {/* Category Sidebar Overlay (Mobile) */}
              {categorySidebarOpen && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                  onClick={() => setCategorySidebarOpen(false)}
                />
              )}

              {/* Sidebar */}
              <aside className={`
                fixed md:relative top-0 left-0 z-50 md:z-0
                w-64 h-full md:h-auto flex-shrink-0 bg-white
                transform transition-transform duration-300 ease-in-out
                ${categorySidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                p-4 md:p-0
              `}>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Categories</h3>
                    <button 
                      onClick={() => setCategorySidebarOpen(false)}
                      className="md:hidden p-1 hover:bg-gray-100 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.name}
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setCurrentPage(1);
                          setCategorySidebarOpen(false);
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

              {/* Tools Grid/List */}
              <main className="flex-1 min-w-0">
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="font-semibold text-gray-900">Tools</h2>
                    <p className="text-sm text-gray-500">
                      {loading ? 'Loading...' : `Showing ${tools.length} of ${tools.length} tools`}
                    </p>
                  </div>
                  
                  {loading ? (
                    <div className="p-12 flex items-center justify-center">
                      <Loader className="w-8 h-8 animate-spin text-blue-600" />
                    </div>
                  ) : tools.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                      No tools found. Add one to get started!
                    </div>
                  ) : (
                    <div className="p-6">
                      {viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {tools.map((tool) => (
                            <div
                              key={tool._id}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {tool.name}
                                  </h3>
                                  <p className="text-xs text-gray-500 mt-1">{tool.category}</p>
                                </div>
                                {tool.license && (
                                  <span className={`px-2 py-1 text-xs rounded ${
                                    tool.license === 'Free' ? 'bg-green-100 text-green-700' :
                                    tool.license === 'Paid' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                    {tool.license}
                                  </span>
                                )}
                              </div>
                              
                              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{tool.description}</p>
                              
                              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                <span>{tool.platform || 'Cross-platform'}</span>
                              </div>
                              
                              <button
                                onClick={() => handleToolClick(tool)}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                View details
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {tools.map((tool) => (
                            <div
                              key={tool._id}
                              onClick={() => handleToolClick(tool)}
                              className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
                            >
                              <div className="flex items-start text-black justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                      {tool.name}
                                    </h3>
                                    {tool.license && (
                                      <span className={`px-2 py-1 text-xs rounded ${
                                        tool.license === 'Free' ? 'bg-green-100 text-green-700' :
                                        tool.license === 'Paid' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'
                                      }`}>
                                        {tool.license}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{tool.description}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>{tool.category}</span>
                                    <span>•</span>
                                    <span>{tool.platform || 'Cross-platform'}</span>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleToolClick(tool);
                                  }}
                                  className="ml-4 flex items-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 font-medium"
                                >
                                  <Eye className="w-4 h-4" />
                                  View details
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pagination */}
                  {!loading && tools.length > 0 && totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
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
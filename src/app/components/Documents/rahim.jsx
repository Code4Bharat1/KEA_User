'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Trash2, 
  Download,
  Eye,
  Plus,
  X
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';
import PDFViewer from './PDFViewer'; // Import the viewer

export default function DocumentsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPDFViewer, setShowPDFViewer] = useState(false);
  const [currentPDF, setCurrentPDF] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  
  const getFileUrl = (filename) => {
    const baseUrl = API_URL.replace('/api', '');
    return `${baseUrl}/uploads/${filename}`;
  };

  useEffect(() => {
    fetchUserData();
    fetchResumes();
  }, []);

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

  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${API_URL}/users/me/resumes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(res.data);
    } catch (err) {
      console.error('Error fetching resumes:', err);
    }
  };

  const handleDeleteResume = async (id) => {
    if (!confirm('Are you sure you want to delete this resume?')) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${API_URL}/users/me/resumes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResumes(resumes.filter(r => r._id !== id));
      alert('Resume deleted successfully!');
    } catch (err) {
      console.error('Error deleting resume:', err);
      alert('Failed to delete resume');
    }
  };

  const handleViewResume = (resume) => {
    setCurrentPDF({
      url: getFileUrl(resume.file),
      name: resume.originalName || resume.title
    });
    setShowPDFViewer(true);
  };

  const handleDownloadResume = (resume) => {
    const url = getFileUrl(resume.file);
    const link = document.createElement('a');
    link.href = url;
    link.download = resume.originalName || 'resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.includes('pdf')) return '📄';
    if (mimeType?.includes('word')) return '📝';
    return '📎';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 overflow-auto">
        <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <div className="p-6">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
                <p className="text-gray-600 mt-1">Manage your resumes and documents</p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Upload Resume
              </button>
            </div>

            {resumes.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No resumes uploaded</h3>
                <p className="text-gray-600 mb-6">Upload your resume to apply for jobs</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  Upload Resume
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="text-3xl">{getFileIcon(resume.mimeType)}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{resume.title}</h3>
                          <p className="text-sm text-gray-600 truncate">{resume.originalName}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                            <span>{formatFileSize(resume.size)}</span>
                            <span>•</span>
                            <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewResume(resume)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleDownloadResume(resume)}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium hover:bg-green-100 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </button>
                      <button
                        onClick={() => handleDeleteResume(resume._id)}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="font-semibold text-blue-900 mb-2">💡 Tips for uploading resumes</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Upload your resume in PDF or Word format</li>
                <li>• Keep your resume updated with latest experience</li>
                <li>• You can upload multiple versions for different job types</li>
                <li>• Maximum file size: 5 MB</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadResumeModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            setShowUploadModal(false);
            fetchResumes();
          }}
        />
      )}

      {/* PDF Viewer */}
      {showPDFViewer && currentPDF && (
        <PDFViewer
          fileUrl={currentPDF.url}
          fileName={currentPDF.name}
          onClose={() => {
            setShowPDFViewer(false);
            setCurrentPDF(null);
          }}
        />
      )}
    </div>
  );
}

function UploadResumeModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5 MB');
        return;
      }
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5 MB');
        return;
      }
      setFile(droppedFile);
      if (!title) {
        setTitle(droppedFile.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('userToken');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);

      await axios.post(`${API_URL}/users/me/resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Resume uploaded successfully!');
      onSuccess();
    } catch (err) {
      console.error('Error uploading resume:', err);
      alert(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Upload Resume</h2>
            <p className="text-sm text-gray-600 mt-1">Upload your resume in PDF or Word format</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Resume Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., Software Engineer Resume"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Upload File *
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-gray-700 font-medium mb-1">
                  {file ? file.name : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX (max. 5MB)</p>
              </label>
            </div>
            {file && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading || !file}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Resume'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  Eye,
  ThumbsUp,
  Share2,
  Pin,
  Lock,
  Trash2,
  User,
  Clock,
  MoreVertical
} from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function ThreadDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [thread, setThread] = useState(null);
  const [reply, setReply] = useState('');
  const [relatedThreads, setRelatedThreads] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchUserData();
    fetchThreadDetail();
    fetchRelatedThreads();
  }, [params.id]);

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

  // const fetchThreadDetail = async () => {
  //   setLoading(true);
  //   try {
  //     const { data } = await axios.get(`${API_URL}/forums/${params.id}`);
  //     setThread(data);
  //   } catch (error) {
  //     console.error('Error fetching thread:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchThreadDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken'); // ✅ same token

      if (!token) {
        console.warn('No user token found');
        setThread(null);
        return;
      }

      const { data } = await axios.get(
        `${API_URL}/forums/${params.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX
          },
        }
      );

      setThread(data);
    } catch (error) {
      console.error('Error fetching thread:', error);
    } finally {
      setLoading(false);
    }
  };


  // const fetchRelatedThreads = async () => {
  //   try {
  //     const { data } = await axios.get(`${API_URL}/forums?limit=5`);
  //     setRelatedThreads(data.threads?.filter(t => t._id !== params.id) || []);
  //   } catch (error) {
  //     console.error('Error fetching related threads:', error);
  //   }
  // };

  const fetchRelatedThreads = async () => {
    try {
      const token = localStorage.getItem('userToken');

      if (!token) return;

      const { data } = await axios.get(
        `${API_URL}/forums?limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ FIX
          },
        }
      );

      setRelatedThreads(
        data.threads?.filter(t => t._id !== params.id) || []
      );
    } catch (error) {
      console.error('Error fetching related threads:', error);
    }
  };


  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/forums/${params.id}/reply`,
        { content: reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply('');
      fetchThreadDetail();
      alert('Reply posted successfully!');
    } catch (error) {
      alert('Failed to post reply');
    }
  };

  const handleLikeReply = async (replyId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/forums/${params.id}/replies/${replyId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchThreadDetail();
    } catch (error) {
      alert('Failed to like reply');
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Thread not found</p>
          <button
            onClick={() => router.push('/dashboard/forums')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Forums
          </button>
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
          <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <button
              onClick={() => router.push('/dashboard/forums')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Forums</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Thread Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="text-blue-600">{thread.category}</span>
                      {thread.tags?.map((tag, idx) => (
                        <span key={idx}>
                          {'>'} <span className="text-blue-600">{tag}</span>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-start gap-3 mb-4">
                      {thread.isPinned && (
                        <Pin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                      )}
                      {thread.isLocked && (
                        <Lock className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                      )}
                      <h1 className="text-2xl font-bold text-gray-900 flex-1">
                        {thread.title}
                      </h1>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{thread.author?.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{thread.views} views</span>
                      </div>
                    </div>
                  </div>

                  <div className="prose max-w-none text-gray-700">
                    <p className="whitespace-pre-wrap">{thread.content}</p>
                  </div>

                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <ThumbsUp className="w-4 h-4" />
                      <span>Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Replies Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Replies ({thread.replies?.length || 0})
                  </h2>

                  {/* Replies List */}
                  <div className="space-y-6 mb-8">
                    {thread.replies && thread.replies.length > 0 ? (
                      thread.replies.map((reply, index) => (
                        <div key={reply._id} className="flex gap-4 pb-6 border-b border-gray-200 last:border-0">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">
                                  {reply.author?.name || 'Anonymous'}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {getTimeAgo(reply.createdAt)}
                                </span>
                              </div>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>
                            <p className="text-gray-700 mb-3 whitespace-pre-wrap">{reply.content}</p>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleLikeReply(reply._id)}
                                className={`flex items-center gap-1 text-sm ${reply.likes?.includes(user?._id)
                                  ? 'text-blue-600'
                                  : 'text-gray-600 hover:text-blue-600'
                                  }`}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>{reply.likes?.length || 0}</span>
                              </button>
                              <button className="text-sm text-gray-600 hover:text-blue-600">
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-500 py-8">
                        No replies yet. Be the first to reply!
                      </p>
                    )}
                  </div>

                  {/* Reply Form */}
                  {!thread.isLocked ? (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Add your reply</h3>
                      <form onSubmit={handleReply}>
                        <textarea
                          value={reply}
                          onChange={(e) => setReply(e.target.value)}
                          placeholder="Write your answer, share references or upload related (PDFs/docs)..."
                          rows={6}
                          className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
                        />
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            Markdown and attributions are allowed, keep discussion professional
                          </p>
                          <button
                            type="submit"
                            disabled={!reply.trim()}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Post reply
                          </button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                      <Lock className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                      <p className="text-sm text-yellow-800">
                        This thread has been locked and no longer accepts replies
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Thread Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Thread info</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{thread.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(thread.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Last activity:</span>
                      <span className="font-medium text-gray-900">
                        {getTimeAgo(thread.lastActivity || thread.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span className="font-medium text-gray-900">{thread.views}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Replies:</span>
                      <span className="font-medium text-gray-900">{thread.replies?.length || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Author Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Started by</h3>
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{thread.author?.name}</p>
                      <p className="text-sm text-gray-600">{thread.author?.profile?.headline || 'Member'}</p>
                    </div>
                  </div>
                </div>

                {/* Related Threads */}
                {relatedThreads.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Related threads</h3>
                    <div className="space-y-4">
                      {relatedThreads.map((relatedThread) => (
                        <button
                          key={relatedThread._id}
                          onClick={() => router.push(`/dashboard/forums/${relatedThread._id}`)}
                          className="block text-left hover:bg-gray-50 p-3 rounded-lg transition-colors w-full"
                        >
                          <h4 className="font-medium text-gray-900 mb-1 line-clamp-2 text-sm">
                            {relatedThread.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <span>{relatedThread.category}</span>
                            <span>•</span>
                            <span>{relatedThread.replies?.length || 0} replies</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Help Resources */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Pro tips! past year civil students looking at bridge design note
                  </h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Student Circle › 3 days ago › 78 replies
                  </p>
                  <button
                    onClick={() => router.push('/dashboard/knowledge')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View all resources →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
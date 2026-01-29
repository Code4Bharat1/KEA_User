'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  User,
  Tag,
  Clock,
  Share2,
  Bookmark,
  ThumbsUp,
  MessageCircle,
  ArrowLeft,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon
} from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function BlogDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchUserData();
    fetchBlogDetail();
    fetchComments();
    fetchRelatedBlogs();
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

  const fetchBlogDetail = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/blogs/${params.id}`);
      setBlog(data);
      setIsLiked(data.likes?.includes(user?._id));
    } catch (error) {
      console.error('Error fetching blog:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/blogs/${params.id}/comments`);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const fetchRelatedBlogs = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/blogs?category=${blog?.category}&limit=5`);
      setRelatedBlogs(data.blogs?.filter(b => b._id !== params.id) || []);
    } catch (error) {
      console.error('Error fetching related blogs:', error);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/blogs/${params.id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsLiked(!isLiked);
      fetchBlogDetail();
    } catch (error) {
      alert('Failed to like blog');
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/blogs/${params.id}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsSaved(!isSaved);
      alert(isSaved ? 'Removed from saved' : 'Saved successfully!');
    } catch (error) {
      alert('Failed to save blog');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/blogs/${params.id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComment('');
      fetchComments();
      alert('Comment posted successfully!');
    } catch (error) {
      alert('Failed to post comment');
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title;

    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      copy: url
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Blog not found</p>
          <button
            onClick={() => router.push('/dashboard/blogs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Blogs
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
              onClick={() => router.push('/dashboard/blogs')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Blogs</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Blog Header */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <div className="mb-6">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {blog.category}
                    </span>
                  </div>

                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {blog.title}
                  </h1>

                  <div className="flex items-center gap-6 text-sm text-gray-600 mb-6">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{blog.author?.name || 'Anonymous'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{blog.readTime || '5 min read'}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {blog.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Featured Image */}
                  {blog.image && (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-auto rounded-lg mb-6"
                    />
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isLiked
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{blog.likes?.length || 0}</span>
                    </button>
                    <button
                      onClick={handleSave}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isSaved
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      <span>Save</span>
                    </button>
                    <div className="relative group">
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        <Share2 className="w-4 h-4" />
                        <span>Share</span>
                      </button>
                      <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2 hidden group-hover:block z-10">
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 rounded"
                        >
                          <Facebook className="w-4 h-4" />
                          <span>Facebook</span>
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 rounded"
                        >
                          <Twitter className="w-4 h-4" />
                          <span>Twitter</span>
                        </button>
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 rounded"
                        >
                          <Linkedin className="w-4 h-4" />
                          <span>LinkedIn</span>
                        </button>
                        <button
                          onClick={() => handleShare('copy')}
                          className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-50 rounded"
                        >
                          <LinkIcon className="w-4 h-4" />
                          <span>Copy Link</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <div
                    className="prose max-w-none text-gray-700"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg border border-gray-200 p-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Comments ({comments.length})
                  </h2>

                  {/* Comment Form */}
                  <form onSubmit={handleComment} className="mb-8">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Write a comment..."
                      rows={4}
                      className="w-full px-4 py-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        disabled={!comment.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Post Comment
                      </button>
                    </div>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-6">
                    {comments.length === 0 ? (
                      <p className="text-center text-gray-500 py-8">
                        No comments yet. Be the first to comment!
                      </p>
                    ) : (
                      comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-gray-900">
                                {comment.user?.name || 'Anonymous'}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Author Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">About Author</h3>
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{blog.author?.name}</p>
                      <p className="text-sm text-gray-600">{blog.author?.profile?.headline || 'Writer'}</p>
                    </div>
                  </div>
                  {blog.author?.profile?.bio && (
                    <p className="text-sm text-gray-600 break-words whitespace-pre-wrap overflow-hidden">
                      {blog.author.profile.bio}
                    </p>
                  )}

                </div>

                {/* Related Articles */}
                {relatedBlogs.length > 0 && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedBlogs.map((relatedBlog) => (
                        <button
                          key={relatedBlog._id}
                          onClick={() => router.push(`/dashboard/blogs/${relatedBlog._id}`)}
                          className="block text-left hover:bg-gray-50 p-3 rounded-lg transition-colors w-full"
                        >
                          <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
                            {relatedBlog.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {new Date(relatedBlog.createdAt).toLocaleDateString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    {['Civil Engineering', 'Structural Design', 'Construction', 'Technology', 'Career'].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => router.push(`/dashboard/blogs?category=${cat}`)}
                        className="block text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors w-full"
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  Users,
  MessageSquare,
  FileText,
  Settings,
  Globe,
  Lock,
  ThumbsUp,
  Send,
  Paperclip,
  MoreVertical,
  UserPlus,
  LogOut,
  Download,
  Eye
} from 'lucide-react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function GroupDetail() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [group, setGroup] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [newPost, setNewPost] = useState('');
  const [newComment, setNewComment] = useState({});

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchUserData();
    fetchGroupDetail();
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

  const fetchGroupDetail = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/groups/${params.id}`);
      setGroup(data);
    } catch (error) {
      console.error('Error fetching group:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/groups/${params.id}/posts`, 
        { content: newPost },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setNewPost('');
      fetchGroupDetail();
      alert('Post created successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create post');
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/groups/${params.id}/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchGroupDetail();
    } catch (error) {
      alert('Failed to like post');
    }
  };

  const handleComment = async (postId) => {
    const content = newComment[postId];
    if (!content || !content.trim()) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/groups/${params.id}/posts/${postId}/comment`, 
        { content },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setNewComment({ ...newComment, [postId]: '' });
      fetchGroupDetail();
    } catch (error) {
      alert('Failed to post comment');
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;

    try {
      const token = localStorage.getItem('userToken');
      await axios.post(`${API_URL}/groups/${params.id}/leave`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      router.push('/dashboard/groups');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to leave group');
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

  const isMember = group?.members?.some(m => m.user?._id === user?._id);
  const isAdmin = group?.admins?.includes(user?._id) || group?.creator?._id === user?._id;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Group not found</p>
          <button
            onClick={() => router.push('/dashboard/groups')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Groups
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
              onClick={() => router.push('/dashboard/groups')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Groups</span>
            </button>

            {/* Group Header */}
            <div className="bg-white rounded-lg border border-gray-200 mb-6">
              {/* Banner */}
              <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-lg"></div>
              
              <div className="p-6">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl font-bold text-gray-900">{group.name}</h1>
                      <span className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {group.type === 'public' ? <Globe className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        <span className="capitalize">{group.type}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{group.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{group.members?.length || 0} members</span>
                      </div>
                      {group.discipline && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {group.discipline}
                        </span>
                      )}
                      {group.region && (
                        <span className="px-2 py-1 bg-gray-100 rounded">
                          {group.region}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {isMember ? (
                      <>
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                          <UserPlus className="w-4 h-4" />
                          <span>Invite</span>
                        </button>
                        <button
                          onClick={handleLeaveGroup}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Leave</span>
                        </button>
                      </>
                    ) : (
                      <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        Join Group
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-t border-gray-200 px-6">
                <div className="flex gap-8">
                  <button
                    onClick={() => setActiveTab('posts')}
                    className={`flex items-center gap-2 py-4 border-b-2 font-medium transition-colors ${
                      activeTab === 'posts'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Posts</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('members')}
                    className={`flex items-center gap-2 py-4 border-b-2 font-medium transition-colors ${
                      activeTab === 'members'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                    <span>Members</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`flex items-center gap-2 py-4 border-b-2 font-medium transition-colors ${
                      activeTab === 'resources'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    <span>Resources</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Posts Tab */}
                {activeTab === 'posts' && (
                  <>
                    {/* Create Post */}
                    {isMember && (
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <form onSubmit={handleCreatePost}>
                          <textarea
                            value={newPost}
                            onChange={(e) => setNewPost(e.target.value)}
                            placeholder="Share an update or question with the group..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                          <div className="flex items-center justify-between mt-3">
                            <button
                              type="button"
                              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                              <Paperclip className="w-4 h-4" />
                              <span>Attach</span>
                            </button>
                            <button
                              type="submit"
                              disabled={!newPost.trim()}
                              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                            >
                              Post
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Posts List */}
                    <div className="space-y-4">
                      {group.posts && group.posts.length > 0 ? (
                        [...group.posts].reverse().map((post) => (
                          <div key={post._id} className="bg-white rounded-lg border border-gray-200 p-6">
                            {/* Post Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <Users className="w-5 h-5 text-gray-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {post.author?.name || 'Anonymous'}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {getTimeAgo(post.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <button className="p-1 hover:bg-gray-100 rounded">
                                <MoreVertical className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>

                            {/* Post Content */}
                            <p className="text-gray-700 mb-4 whitespace-pre-wrap">{post.content}</p>

                            {/* Post Actions */}
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
                              <button
                                onClick={() => handleLikePost(post._id)}
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                                  post.likes?.includes(user?._id)
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span className="text-sm">{post.likes?.length || 0}</span>
                              </button>
                              <button className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
                                <MessageSquare className="w-4 h-4" />
                                <span className="text-sm">{post.comments?.length || 0}</span>
                              </button>
                            </div>

                            {/* Comments */}
                            {post.comments && post.comments.length > 0 && (
                              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                {post.comments.map((comment, idx) => (
                                  <div key={idx} className="flex gap-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                      <Users className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-900">
                                          {comment.author?.name || 'Anonymous'}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                          {getTimeAgo(comment.createdAt)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-700">{comment.content}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Comment Input */}
                            {isMember && (
                              <div className="mt-4 flex gap-2">
                                <input
                                  type="text"
                                  value={newComment[post._id] || ''}
                                  onChange={(e) => setNewComment({ ...newComment, [post._id]: e.target.value })}
                                  placeholder="Write a comment..."
                                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleComment(post._id);
                                    }
                                  }}
                                />
                                <button
                                  onClick={() => handleComment(post._id)}
                                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                  <Send className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                          <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No posts yet. Be the first to post!</p>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* Members Tab */}
                {activeTab === 'members' && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Members ({group.members?.length || 0})
                    </h2>
                    <div className="space-y-3">
                      {group.members?.map((member) => (
                        <div key={member._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{member.user?.name}</p>
                              <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            {getTimeAgo(member.joinedAt)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Group Resources
                    </h2>
                    {group.resources && group.resources.length > 0 ? (
                      <div className="space-y-3">
                        {group.resources.map((resource, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                            <div className="flex items-center gap-3">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="font-medium text-gray-900">{resource.title}</p>
                                <p className="text-sm text-gray-600">{resource.description}</p>
                              </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                              <Download className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No resources yet</p>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Group Info */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Group overview</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <p className="font-medium text-gray-900">{group.category}</p>
                    </div>
                    {group.discipline && (
                      <div>
                        <span className="text-gray-600">Discipline:</span>
                        <p className="font-medium text-gray-900">{group.discipline}</p>
                      </div>
                    )}
                    {group.region && (
                      <div>
                        <span className="text-gray-600">Location:</span>
                        <p className="font-medium text-gray-900">{group.region}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Created:</span>
                      <p className="font-medium text-gray-900">
                        {new Date(group.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Members */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Members</h3>
                  <div className="space-y-3">
                    {group.members?.slice(0, 5).map((member) => (
                      <div key={member._id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {member.user?.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {group.members?.length > 5 && (
                    <button
                      onClick={() => setActiveTab('members')}
                      className="text-sm text-blue-600 hover:text-blue-700 mt-3"
                    >
                      View all →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// 'use client';

// import { useState, useEffect } from 'react';
// import { 
//   User, 
//   Mail, 
//   Phone, 
//   MapPin, 
//   Briefcase, 
//   GraduationCap,
//   Edit,
//   Save,
//   X,
//   Camera,
//   Plus,
//   Trash2,
//   Calendar,
//   Building,
//   CheckCircle,
//   FileText,
// } from 'lucide-react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';
// import UserSidebar from '../layout/sidebar';
// import UserNavbar from '../layout/navbar';

// export default function UserProfile() {
//   const router = useRouter();
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     countryCode: '+91',
//     location: '',
//     nativeAddition: '',
//     headline: '',
//     bio: '',
//     avatar: '',
//     company: '',
//     position: '',
//     yearsOfExperience: '',
//     category: '',
//     country: 'IN',
//     skills: [],
//     experience: [],
//     education: [],
//     branch: '',
//     socialLinks: {
//       linkedin: '',
//       github: '',
//       twitter: '',
//       website: '',
//     }
//   });

//   const [newSkill, setNewSkill] = useState('');
//   const [editingExpIndex, setEditingExpIndex] = useState(null);
//   const [editingEduIndex, setEditingEduIndex] = useState(null);
//   const [newExperience, setNewExperience] = useState({
//     company: '',
//     position: '',
//     from: '',
//     to: '',
//     description: '',
//   });
//   const [newEducation, setNewEducation] = useState({
//     institution: '',
//     degree: '',
//     from: '',
//     to: '',
//   });

//   const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7101/api';

//   const categories = [
//     'Software Engineering',
//     'Civil Engineering',
//     'Mechanical Engineering',
//     'Electrical Engineering',
//     'Electronics Engineering',
//     'Chemical Engineering',
//     'Computer Engineering',
//     'Architecture',
//     'Other'
//   ];

//   const countries = [
//     { code: 'IN', name: 'India', dialCode: '+91' },
//     { code: 'US', name: 'United States', dialCode: '+1' },
//     { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
//     { code: 'CA', name: 'Canada', dialCode: '+1' },
//     { code: 'AU', name: 'Australia', dialCode: '+61' },
//     { code: 'AE', name: 'UAE', dialCode: '+971' },
//     { code: 'SG', name: 'Singapore', dialCode: '+65' },
//     { code: 'DE', name: 'Germany', dialCode: '+49' },
//     { code: 'FR', name: 'France', dialCode: '+33' },
//     { code: 'JP', name: 'Japan', dialCode: '+81' },
//   ];

//   useEffect(() => {
//     fetchUserProfile();
//   }, []);

//   const fetchUserProfile = async () => {
//     try {
//       const token = localStorage.getItem('userToken');
//       if (!token) {
//         router.push('/login');
//         return;
//       }

//       const res = await axios.get(`${API_URL}/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
      
//       const userData = res.data;
//       console.log('User data from backend:', userData);
//       setUser(userData);
      
//       setFormData({
//         name: userData.name || '',
//         email: userData.email || '',
//         phone: userData.profile?.phone || '',
//         countryCode: userData.profile?.countryCode || '+91',
//         location: userData.profile?.location || '',
//         nativeAddition: userData.profile?.nativeAddition || '',
//         headline: userData.profile?.headline || '',
//         bio: userData.profile?.bio || '',
//         avatar: userData.profile?.avatar || userData.avatar || '',
//         company: userData.profile?.company || '',
//         position: userData.profile?.position || '',
//         yearsOfExperience: userData.profile?.yearsOfExperience || '',
//         category: userData.profile?.category || '',
//         country: userData.profile?.country || 'IN',
//         skills: userData.profile?.skills || [],
//         experience: userData.profile?.experience || [],
//         education: userData.profile?.education || [],
//         branch: userData.profile?.branch || 'Bangalore',
//         socialLinks: userData.profile?.socialLinks || {
//           linkedin: '',
//           github: '',
//           twitter: '',
//           website: '',
//         }
//       });
//     } catch (err) {
//       console.error('Error fetching profile:', err);
//       if (err.response?.status === 401) {
//         localStorage.removeItem('userToken');
//         router.push('/login');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleAddSkill = () => {
//     if (newSkill.trim()) {
//       setFormData({
//         ...formData,
//         skills: [...formData.skills, newSkill.trim()]
//       });
//       setNewSkill('');
//     }
//   };

//   const handleRemoveSkill = (index) => {
//     setFormData({
//       ...formData,
//       skills: formData.skills.filter((_, i) => i !== index)
//     });
//   };

//   const handleAddExperience = () => {
//     if (newExperience.company && newExperience.position) {
//       setFormData({
//         ...formData,
//         experience: [...formData.experience, newExperience]
//       });
//       setNewExperience({
//         company: '',
//         position: '',
//         from: '',
//         to: '',
//         description: '',
//       });
//     }
//   };

//   const handleEditExperience = (index) => {
//     setEditingExpIndex(index);
//     setNewExperience(formData.experience[index]);
//   };

//   const handleUpdateExperience = () => {
//     const updatedExp = [...formData.experience];
//     updatedExp[editingExpIndex] = newExperience;
//     setFormData({ ...formData, experience: updatedExp });
//     setEditingExpIndex(null);
//     setNewExperience({
//       company: '',
//       position: '',
//       from: '',
//       to: '',
//       description: '',
//     });
//   };

//   const handleRemoveExperience = (index) => {
//     setFormData({
//       ...formData,
//       experience: formData.experience.filter((_, i) => i !== index)
//     });
//   };

//   const handleAddEducation = () => {
//     if (newEducation.institution && newEducation.degree) {
//       setFormData({
//         ...formData,
//         education: [...formData.education, newEducation]
//       });
//       setNewEducation({
//         institution: '',
//         degree: '',
//         from: '',
//         to: '',
//       });
//     }
//   };

//   const handleEditEducation = (index) => {
//     setEditingEduIndex(index);
//     setNewEducation(formData.education[index]);
//   };

//   const handleUpdateEducation = () => {
//     const updatedEdu = [...formData.education];
//     updatedEdu[editingEduIndex] = newEducation;
//     setFormData({ ...formData, education: updatedEdu });
//     setEditingEduIndex(null);
//     setNewEducation({
//       institution: '',
//       degree: '',
//       from: '',
//       to: '',
//     });
//   };

//   const handleRemoveEducation = (index) => {
//     setFormData({
//       ...formData,
//       education: formData.education.filter((_, i) => i !== index)
//     });
//   };

//   const handleSaveProfile = async () => {
//     setSaving(true);
//     try {
//       const token = localStorage.getItem('userToken');
      
//       const updatePayload = {
//         name: formData.name,
//         email: formData.email,
//         avatar: formData.avatar,
//         profile: {
//           phone: formData.phone,
//           countryCode: formData.countryCode,
//           location: formData.location,
//           nativeAddition: formData.nativeAddition,
//           headline: formData.headline,
//           bio: formData.bio,
//           company: formData.company,
//           position: formData.position,
//           yearsOfExperience: formData.yearsOfExperience,
//           category: formData.category,
//           country: formData.country,
//           skills: formData.skills,
//           experience: formData.experience,
//           education: formData.education,
//           branch: formData.branch,
//           avatar: formData.avatar,
//           socialLinks: formData.socialLinks,
//         }
//       };

//       console.log('Sending update payload:', updatePayload);

//       const res = await axios.put(
//         `${API_URL}/users/me`,
//         updatePayload,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       console.log('Update response:', res.data);
//       setUser(res.data);
      
//       localStorage.setItem('userData', JSON.stringify({
//         id: res.data._id,
//         name: res.data.name,
//         email: res.data.email,
//         membershipStatus: res.data.membershipStatus,
//       }));

//       alert('✅ Profile updated successfully!');
//       setIsEditing(false);
//       await fetchUserProfile();
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       alert(err.response?.data?.message || '❌ Failed to update profile');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return '';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
//   };

//   const getInitials = (name) => {
//     if (!name) return 'U';
//     return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
//   };

//   const calculateProfileCompletion = () => {
//     let score = 0;
//     if (formData.name) score += 10;
//     if (formData.email) score += 10;
//     if (formData.phone) score += 10;
//     if (formData.headline) score += 10;
//     if (formData.bio) score += 10;
//     if (formData.location) score += 5;
//     if (formData.nativeAddition) score += 5;
//     if (formData.category) score += 5;
//     if (formData.country) score += 5;
//     if (formData.skills.length > 0) score += 10;
//     if (formData.experience.length > 0) score += 10;
//     if (formData.education.length > 0) score += 10;
//     return Math.min(score, 100);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       <UserSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       <div className="flex-1 overflow-auto">
//         <UserNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

//         <div className="p-6">
//           <div className="max-w-7xl mx-auto">
//             {/* Header */}
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
//                 <p className="text-sm text-gray-600">View and manage your membership information</p>
//               </div>
//               <div className="flex items-center gap-3">
//                 {!isEditing ? (
//                   <>
//                     <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
//                       <CheckCircle className="w-4 h-4 text-green-600" />
//                       Profile verified
//                     </button>
//                     <button
//                       onClick={() => setIsEditing(true)}
//                       className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
//                     >
//                       <Edit className="w-4 h-4" />
//                       Edit profile
//                     </button>
//                   </>
//                 ) : (
//                   <div className="flex gap-3">
//                     <button
//                       onClick={handleSaveProfile}
//                       disabled={saving}
//                       className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
//                     >
//                       <Save className="w-4 h-4" />
//                       {saving ? 'Saving...' : 'Save Changes'}
//                     </button>
//                     <button
//                       onClick={() => { 
//                         fetchUserProfile(); 
//                         setIsEditing(false);
//                         setEditingExpIndex(null);
//                         setEditingEduIndex(null);
//                       }}
//                       disabled={saving}
//                       className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
//                     >
//                       <X className="w-4 h-4" />
//                       Cancel
//                     </button>
//                   </div>
//                 )}
//                 <div className="flex items-center gap-2 text-sm">
//                   <User className="w-4 h-4 text-gray-600" />
//                   <div className="text-right">
//                     <div className="font-medium text-gray-900">{formData.name}</div>
//                     <div className="text-xs text-gray-500">{formData.category || 'Civil Engineering'}</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               {/* Main Content */}
//               <div className="lg:col-span-2 space-y-6">
//                 {/* Profile Header Card */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-6">
//                   <div className="flex items-start justify-between mb-6">
//                     <div className="flex items-start gap-4">
//                       {/* Avatar */}
//                       <div className="relative">
//                         {formData.avatar ? (
//                           <img
//                             src={formData.avatar}
//                             alt={formData.name}
//                             className="w-20 h-20 rounded-full object-cover"
//                             onError={(e) => {
//                               e.target.style.display = 'none';
//                               e.target.nextSibling.style.display = 'flex';
//                             }}
//                           />
//                         ) : null}
//                         <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold ${formData.avatar ? 'hidden' : ''}`}>
//                           {getInitials(formData.name)}
//                         </div>
//                         {isEditing && (
//                           <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200">
//                             <Camera className="w-3 h-3 text-gray-600" />
//                           </button>
//                         )}
//                       </div>

//                       {/* Name and Info */}
//                       <div className="flex-1">
//                         {isEditing ? (
//                           <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             className="text-xl font-bold text-gray-900 mb-1 w-full border border-gray-300 rounded px-2 py-1"
//                             placeholder="Your name"
//                           />
//                         ) : (
//                           <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
//                         )}
                        
//                         {isEditing ? (
//                           <input
//                             type="text"
//                             name="headline"
//                             value={formData.headline}
//                             onChange={handleInputChange}
//                             className="text-sm text-gray-600 w-full border border-gray-300 rounded px-2 py-1 mt-1"
//                             placeholder="Professional headline"
//                           />
//                         ) : (
//                           <p className="text-sm text-gray-600">
//                             {formData.headline || `${formData.category} • Member since ${user?.createdAt ? new Date(user.createdAt).getFullYear() : '2023'}`}
//                           </p>
//                         )}
                        
//                         <p className="text-xs text-gray-500 mt-1">
//                           {formData.position || 'Position'} • {formData.company || 'Company'} • {formData.location || 'Location'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Personal Details */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-base font-semibold text-gray-900">Personal details</h3>
//                     <span className="text-xs text-gray-500">Basic information linked to your membership</span>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">Full name</label>
//                         {isEditing ? (
//                           <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleInputChange}
//                             className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                           />
//                         ) : (
//                           <p className="text-sm text-gray-900">{formData.name}</p>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">Position</label>
//                         {isEditing ? (
//                           <input
//                             type="text"
//                             name="position"
//                             value={formData.position}
//                             onChange={handleInputChange}
//                             className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                             placeholder="e.g., Senior Engineer"
//                           />
//                         ) : (
//                           <p className="text-sm text-gray-900">{formData.position || 'Not set'}</p>
//                         )}
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">Email</label>
//                         {isEditing ? (
//                           <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleInputChange}
//                             className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                           />
//                         ) : (
//                           <p className="text-sm text-gray-900">{formData.email}</p>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">Company</label>
//                         {isEditing ? (
//                           <input
//                             type="text"
//                             name="company"
//                             value={formData.company}
//                             onChange={handleInputChange}
//                             className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                             placeholder="e.g., ABC Constructions"
//                           />
//                         ) : (
//                           <p className="text-sm text-gray-900">{formData.company || 'Not set'}</p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Native Addition */}
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Native Addition</label>
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           name="nativeAddition"
//                           value={formData.nativeAddition}
//                           onChange={handleInputChange}
//                           className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                           placeholder="Native to be add under profile"
//                         />
//                       ) : (
//                         <p className="text-sm text-gray-900">{formData.nativeAddition || 'Not set'}</p>
//                       )}
//                     </div>

//                     {/* Category */}
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Category</label>
//                       {isEditing ? (
//                         <select
//                           name="category"
//                           value={formData.category}
//                           onChange={handleInputChange}
//                           className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                         >
//                           <option value="">Select Stream</option>
//                           {categories.map((cat) => (
//                             <option key={cat} value={cat}>{cat}</option>
//                           ))}
//                         </select>
//                       ) : (
//                         <p className="text-sm text-gray-900">{formData.category || 'Not set'}</p>
//                       )}
//                     </div>

//                     {/* Country */}
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Country</label>
//                       {isEditing ? (
//                         <select
//                           name="country"
//                           value={formData.country}
//                           onChange={handleInputChange}
//                           className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                         >
//                           <option value="">Country to be replace by Field</option>
//                           {countries.map((country) => (
//                             <option key={country.code} value={country.code}>
//                               {country.name}
//                             </option>
//                           ))}
//                         </select>
//                       ) : (
//                         <p className="text-sm text-gray-900">
//                           {countries.find(c => c.code === formData.country)?.name || 'Not set'}
//                         </p>
//                       )}
//                     </div>

//                     {/* Phone with Country Code */}
//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Phone</label>
//                       {isEditing ? (
//                         <div className="flex gap-2">
//                           <select
//                             name="countryCode"
//                             value={formData.countryCode}
//                             onChange={handleInputChange}
//                             className="w-32 text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                           >
//                             {countries.map((country) => (
//                               <option key={country.code} value={country.dialCode}>
//                                 {country.dialCode} ({country.code})
//                               </option>
//                             ))}
//                           </select>
//                           <input
//                             type="tel"
//                             name="phone"
//                             value={formData.phone}
//                             onChange={handleInputChange}
//                             className="flex-1 text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                             placeholder="Phone - country code to add"
//                           />
//                         </div>
//                       ) : (
//                         <p className="text-sm text-gray-900">
//                           {formData.countryCode && formData.phone ? `${formData.countryCode} ${formData.phone}` : 'Not set'}
//                         </p>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">Location</label>
//                         {isEditing ? (
//                           <input
//                             type="text"
//                             name="location"
//                             value={formData.location}
//                             onChange={handleInputChange}
//                             className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                             placeholder="e.g., Bangalore, Karnataka"
//                           />
//                         ) : (
//                           <p className="text-sm text-gray-900">{formData.location || 'Not set'}</p>
//                         )}
//                       </div>
//                       <div>
//                         <label className="block text-xs text-gray-600 mb-1">Years of Experience</label>
//                         {isEditing ? (
//                           <input
//                             type="text"
//                             name="yearsOfExperience"
//                             value={formData.yearsOfExperience}
//                             onChange={handleInputChange}
//                             className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                             placeholder="e.g., 5 years"
//                           />
//                         ) : (
//                           <p className="text-sm text-gray-900">{formData.yearsOfExperience || 'Not set'}</p>
//                         )}
//                       </div>
//                     </div>

//                     <div>
//                       <label className="block text-xs text-gray-600 mb-1">Bio</label>
//                       {isEditing ? (
//                         <textarea
//                           name="bio"
//                           value={formData.bio}
//                           onChange={handleInputChange}
//                           rows="3"
//                           className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
//                           placeholder="Tell us about yourself..."
//                         />
//                       ) : (
//                         <p className="text-sm text-gray-900">{formData.bio || 'No bio added yet'}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Skills */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-base font-semibold text-gray-900">Skills</h3>
//                     <span className="text-xs text-gray-500">Highlight your top expertise</span>
//                   </div>
                  
//                   <div className="flex flex-wrap gap-2 mb-4">
//                     {formData.skills.length > 0 ? (
//                       formData.skills.map((skill, index) => (
//                         <span
//                           key={index}
//                           className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
//                         >
//                           {skill}
//                           {isEditing && (
//                             <button onClick={() => handleRemoveSkill(index)} className="hover:text-gray-900">
//                               <X className="w-3 h-3" />
//                             </button>
//                           )}
//                         </span>
//                       ))
//                     ) : (
//                       <div className="text-sm text-gray-500">No skills added yet</div>
//                     )}
//                   </div>

//                   {isEditing && (
//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         value={newSkill}
//                         onChange={(e) => setNewSkill(e.target.value)}
//                         onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
//                         placeholder="Add a skill (e.g., Structural design, AutoCAD)"
//                         className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       />
//                       <button
//                         onClick={handleAddSkill}
//                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
//                       >
//                         Add
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Experience */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-base font-semibold text-gray-900">Experience</h3>
//                     <span className="text-xs text-gray-500">Timeline of your professional journey</span>
//                   </div>

//                   <div className="space-y-4">
//                     {formData.experience.length > 0 ? (
//                       formData.experience.map((exp, index) => (
//                         <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
//                           <div className="flex-1">
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <h4 className="font-semibold text-gray-900 text-sm">{exp.position}</h4>
//                                 <p className="text-sm text-gray-600">{exp.company}</p>
//                                 <p className="text-xs text-gray-500 mt-1">
//                                   {formatDate(exp.from)} - {exp.to ? formatDate(exp.to) : 'Present'}
//                                 </p>
//                                 {exp.description && (
//                                   <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
//                                 )}
//                               </div>
//                               {isEditing && (
//                                 <div className="flex gap-2">
//                                   <button 
//                                     onClick={() => handleEditExperience(index)} 
//                                     className="text-blue-600 hover:text-blue-700"
//                                   >
//                                     <Edit className="w-4 h-4" />
//                                   </button>
//                                   <button 
//                                     onClick={() => handleRemoveExperience(index)} 
//                                     className="text-red-600 hover:text-red-700"
//                                   >
//                                     <Trash2 className="w-4 h-4" />
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-sm text-gray-500">No experience added yet</p>
//                     )}
//                   </div>

//                   {isEditing && (
//                     <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
//                       <h4 className="text-sm font-semibold text-gray-900">
//                         {editingExpIndex !== null ? 'Edit Experience' : 'Add New Experience'}
//                       </h4>
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           type="text"
//                           value={newExperience.position}
//                           onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
//                           placeholder="Position"
//                           className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                         />
//                         <input
//                           type="text"
//                           value={newExperience.company}
//                           onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
//                           placeholder="Company"
//                           className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                         />
//                         <input
//                           type="date"
//                           value={newExperience.from}
//                           onChange={(e) => setNewExperience({...newExperience, from: e.target.value})}
//                           placeholder="From"
//                           className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                         />
//                         <input
//                           type="date"
//                           value={newExperience.to}
//                           onChange={(e) => setNewExperience({...newExperience, to: e.target.value})}
//                           placeholder="To (leave empty if current)"
//                           className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                       <textarea
//                         value={newExperience.description}
//                         onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
//                         placeholder="Description"
//                         rows="2"
//                         className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                       />
//                       <button
//                         onClick={editingExpIndex !== null ? handleUpdateExperience : handleAddExperience}
//                         className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
//                       >
//                         {editingExpIndex !== null ? 'Update Experience' : 'Add Experience'}
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 {/* Education */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-6">
//                   <div className="flex items-center justify-between mb-4">
//                     <h3 className="text-base font-semibold text-gray-900">Education</h3>
//                     <span className="text-xs text-gray-500">Your academic background</span>
//                   </div>

//                   <div className="space-y-4">
//                     {formData.education.length > 0 ? (
//                       formData.education.map((edu, index) => (
//                         <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
//                           <div className="flex-1">
//                             <div className="flex items-start justify-between">
//                               <div className="flex-1">
//                                 <h4 className="font-semibold text-gray-900 text-sm">{edu.degree}</h4>
//                                 <p className="text-sm text-gray-600">{edu.institution}</p>
//                                 <p className="text-xs text-gray-500 mt-1">
//                                   {formatDate(edu.from)} - {formatDate(edu.to)}
//                                 </p>
//                               </div>
//                               {isEditing && (
//                                 <div className="flex gap-2">
//                                   <button 
//                                     onClick={() => handleEditEducation(index)} 
//                                     className="text-blue-600 hover:text-blue-700"
//                                   >
//                                     <Edit className="w-4 h-4" />
//                                   </button>
//                                   <button 
//                                     onClick={() => handleRemoveEducation(index)} 
//                                     className="text-red-600 hover:text-red-700"
//                                   >
//                                     <Trash2 className="w-4 h-4" />
//                                   </button>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       ))
//                     ) : (
//                       <p className="text-sm text-gray-500">No education added yet</p>
//                     )}
//                   </div>

//                   {isEditing && (
//                     <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
//                       <h4 className="text-sm font-semibold text-gray-900">
//                         {editingEduIndex !== null ? 'Edit Education' : 'Add New Education'}
//                       </h4>
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           type="text"
//                           value={newEducation.degree}
//                           onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
//                           placeholder="Degree (e.g., B.E. Civil Engineering)"
//                           className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                         />
//                         <input
//                           type="text"
//                           value={newEducation.institution}
//                           onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
//                           placeholder="Institution"
//                           className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                         />
//                         <input
//                           type="date"
//                           value={newEducation.from}
//                           onChange={(e) => setNewEducation({...newEducation, from: e.target.value})}
//                           placeholder="From"
//                           className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                         />
//                         <input
//                           type="date"
//                           value={newEducation.to}
//                           onChange={(e) => setNewEducation({...newEducation, to: e.target.value})}
//                           placeholder="To"
//                           className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
//                         />
//                       </div>
//                       <button
//                         onClick={editingEduIndex !== null ? handleUpdateEducation : handleAddEducation}
//                         className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
//                       >
//                         {editingEduIndex !== null ? 'Update Education' : 'Add Education'}
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Right Sidebar */}
//               <div className="lg:col-span-1 space-y-6">
//                 {/* Membership & Branch */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-5">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-4">Membership & branch</h3>
//                   <div className="space-y-3 text-sm">
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Member ID</span>
//                       <span className="font-medium text-gray-900">{user?.memberId || 'KEA-001'}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Branch</span>
//                       {isEditing ? (
//                         <input
//                           type="text"
//                           name="branch"
//                           value={formData.branch}
//                           onChange={handleInputChange}
//                           className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-0.5 w-24"
//                         />
//                       ) : (
//                         <span className="font-medium text-gray-900">{formData.branch}</span>
//                       )}
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Status</span>
//                       <span className="inline-flex items-center gap-1 text-green-600 font-medium">
//                         <CheckCircle className="w-3 h-3" />
//                         {user?.membershipStatus || 'Active'}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-600">Joined</span>
//                       <span className="font-medium text-gray-900">
//                         {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Apr 2023'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Profile Completion */}
//                 <div className="bg-white rounded-lg border border-gray-200 p-5">
//                   <h3 className="text-sm font-semibold text-gray-900 mb-3">Profile completion</h3>
//                   <p className="text-xs text-gray-600 mb-3">Building your network for your own search</p>
//                   <div className="mb-4">
//                     <div className="flex justify-between text-xs mb-1">
//                       <span className="text-gray-600">Progress</span>
//                       <span className="font-medium text-gray-900">{calculateProfileCompletion()}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div 
//                         className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
//                         style={{ width: `${calculateProfileCompletion()}%` }}
//                       ></div>
//                     </div>
//                   </div>
//                   <p className="text-xs text-gray-600 mb-3">
//                     {calculateProfileCompletion() === 100 
//                       ? 'Your profile is complete! Great job!' 
//                       : 'Your profile is still incomplete. Add more information to reach 100%.'}
//                   </p>
//                   <button 
//                     onClick={() => setIsEditing(true)}
//                     className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
//                   >
//                     Complete profile
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  Edit,
  Save,
  X,
  Camera,
  Plus,
  Trash2,
  Calendar,
  Building,
  CheckCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import UserSidebar from '../layout/sidebar';
import UserNavbar from '../layout/navbar';

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    location: '',
    nativeAddition: '',
    headline: '',
    bio: '',
    avatar: '',
    company: '',
    position: '',
    yearsOfExperience: '',
    category: '',
    otherCategory: '',
    country: 'IN',
    skills: [],
    experience: [],
    education: [],
    branch: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: '',
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [editingExpIndex, setEditingExpIndex] = useState(null);
  const [editingEduIndex, setEditingEduIndex] = useState(null);
  const [newExperience, setNewExperience] = useState({
    company: '',
    position: '',
    from: '',
    to: '',
    description: '',
  });
  const [newEducation, setNewEducation] = useState({
    institution: '',
    degree: '',
    from: '',
    to: '',
  });

  // Calendar states
  const [showFromCalendar, setShowFromCalendar] = useState(false);
  const [showToCalendar, setShowToCalendar] = useState(false);
  const [fromCalendarDate, setFromCalendarDate] = useState(new Date());
  const [toCalendarDate, setToCalendarDate] = useState(new Date());

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7101/api';

  const categories = [
    'Software Engineering',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Electronics Engineering',
    'Chemical Engineering',
    'Computer Engineering',
    'Architecture',
    'Other'
  ];

  const countries = [
    { code: 'IN', name: 'India', dialCode: '+91' },
    { code: 'US', name: 'United States', dialCode: '+1' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
    { code: 'CA', name: 'Canada', dialCode: '+1' },
    { code: 'AU', name: 'Australia', dialCode: '+61' },
    { code: 'AE', name: 'UAE', dialCode: '+971' },
    { code: 'SG', name: 'Singapore', dialCode: '+65' },
    { code: 'DE', name: 'Germany', dialCode: '+49' },
    { code: 'FR', name: 'France', dialCode: '+33' },
    { code: 'JP', name: 'Japan', dialCode: '+81' },
  ];

  // Months array
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate years array (from 1970 to current year + 5)
  const getYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let year = 1970; year <= currentYear + 5; year++) {
      years.push(year);
    }
    return years;
  };

  // Generate days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Calendar component for date selection
  const CalendarPicker = ({ isOpen, date, onDateSelect, onClose }) => {
    if (!isOpen) return null;

    const [currentDate, setCurrentDate] = useState(date);
    const [view, setView] = useState('month'); // 'month' or 'year'

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const prevMonth = () => {
      setCurrentDate(new Date(year, month - 1, 1));
    };
    
    const nextMonth = () => {
      setCurrentDate(new Date(year, month + 1, 1));
    };
    
    const handleDateClick = (day) => {
      const selectedDate = new Date(year, month, day);
      const formattedDate = `${selectedDate.getFullYear()}/${String(selectedDate.getMonth() + 1).padStart(2, '0')}`;
      onDateSelect(formattedDate);
      onClose();
    };
    
    const handleYearSelect = (selectedYear) => {
      setCurrentDate(new Date(selectedYear, month, 1));
      setView('month');
    };

    return (
      <div className="absolute z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-64">
        <div className="flex justify-between items-center mb-4">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('month')}
              className="font-semibold hover:text-blue-600"
            >
              {months[month]}
            </button>
            <button 
              onClick={() => setView('year')}
              className="font-semibold hover:text-blue-600"
            >
              {year}
            </button>
          </div>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {view === 'month' ? (
          <>
            {/* Day headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <div key={day} className="text-center text-xs font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, index) => (
                <div key={`empty-${index}`} className="h-8"></div>
              ))}
              
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const isToday = day === new Date().getDate() && 
                               month === new Date().getMonth() && 
                               year === new Date().getFullYear();
                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(day)}
                    className={`h-8 flex items-center justify-center text-sm rounded hover:bg-blue-100 ${
                      isToday ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          // Year selection view
          <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {getYears().map((year) => (
              <button
                key={year}
                onClick={() => handleYearSelect(year)}
                className={`p-2 text-sm rounded hover:bg-blue-100 ${
                  year === currentDate.getFullYear() ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              onDateSelect('Present');
              onClose();
            }}
            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
          >
            Set as Present
          </button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        router.push('/login');
        return;
      }

      const res = await axios.get(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const userData = res.data;
      console.log('DEBUG fetchUserProfile - User data:', userData);
      console.log('DEBUG fetchUserProfile - Category:', userData.profile?.category);
      console.log('DEBUG fetchUserProfile - OtherCategory:', userData.profile?.otherCategory);
      console.log('DEBUG fetchUserProfile - Profile:', userData.profile);
      
      // Check if category is custom or predefined
      const userCategory = userData.profile?.category || '';
      const userOtherCategory = userData.profile?.otherCategory || '';
      
      let finalCategory = userCategory;
      let finalOtherCategory = userOtherCategory;
      
      // Logic to handle "Other" category
      if (userCategory && !categories.includes(userCategory)) {
        // Agar category allowed list me nahi hai (like "builder")
        finalCategory = 'Other';
        finalOtherCategory = userCategory;
      } else if (userCategory === 'Other' && userOtherCategory) {
        // Agar category "Other" hai aur otherCategory me value hai
        finalCategory = 'Other';
        finalOtherCategory = userOtherCategory;
      }
      
      console.log('DEBUG fetchUserProfile - Setting category:', finalCategory);
      console.log('DEBUG fetchUserProfile - Setting otherCategory:', finalOtherCategory);
      
      setUser(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.profile?.phone || '',
        countryCode: userData.profile?.countryCode || '+91',
        location: userData.profile?.location || '',
        nativeAddition: userData.profile?.nativeAddition || '',
        headline: userData.profile?.headline || '',
        bio: userData.profile?.bio || '',
        avatar: userData.profile?.avatar || userData.avatar || '',
        company: userData.profile?.company || '',
        position: userData.profile?.position || '',
        yearsOfExperience: userData.profile?.yearsOfExperience || '',
        category: finalCategory,
        otherCategory: finalOtherCategory,
        country: userData.profile?.country || 'IN',
        skills: userData.profile?.skills || [],
        experience: userData.experience || userData.profile?.experience || [],
        education: userData.education || userData.profile?.education || [],
        branch: userData.profile?.branch || 'Bangalore',
        socialLinks: userData.profile?.socialLinks || {
          linkedin: '',
          github: '',
          twitter: '',
          website: '',
        }
      });
    } catch (err) {
      console.error('Error fetching profile:', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('userToken');
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (index) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index)
    });
  };

  const handleAddExperience = () => {
    if (newExperience.company && newExperience.position) {
      setFormData({
        ...formData,
        experience: [...formData.experience, newExperience]
      });
      setNewExperience({
        company: '',
        position: '',
        from: '',
        to: '',
        description: '',
      });
    }
  };

  const handleEditExperience = (index) => {
    setEditingExpIndex(index);
    setNewExperience(formData.experience[index]);
  };

  const handleUpdateExperience = () => {
    const updatedExp = [...formData.experience];
    updatedExp[editingExpIndex] = newExperience;
    setFormData({ ...formData, experience: updatedExp });
    setEditingExpIndex(null);
    setNewExperience({
      company: '',
      position: '',
      from: '',
      to: '',
      description: '',
    });
  };

  const handleRemoveExperience = (index) => {
    setFormData({
      ...formData,
      experience: formData.experience.filter((_, i) => i !== index)
    });
  };

  const handleAddEducation = () => {
    if (newEducation.institution && newEducation.degree) {
      setFormData({
        ...formData,
        education: [...formData.education, newEducation]
      });
      setNewEducation({
        institution: '',
        degree: '',
        from: '',
        to: '',
      });
    }
  };

  const handleEditEducation = (index) => {
    setEditingEduIndex(index);
    setNewEducation(formData.education[index]);
  };

  const handleUpdateEducation = () => {
    const updatedEdu = [...formData.education];
    updatedEdu[editingEduIndex] = newEducation;
    setFormData({ ...formData, education: updatedEdu });
    setEditingEduIndex(null);
    setNewEducation({
      institution: '',
      degree: '',
      from: '',
      to: '',
    });
  };

  const handleRemoveEducation = (index) => {
    setFormData({
      ...formData,
      education: formData.education.filter((_, i) => i !== index)
    });
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('userToken');
      
      console.log('DEBUG handleSaveProfile - Form data before saving:', {
        category: formData.category,
        otherCategory: formData.otherCategory
      });
      
      // Determine final category value
      let finalCategory;
      let finalOtherCategory;
      
      if (formData.category === 'Other') {
        if (formData.otherCategory.trim()) {
          finalCategory = formData.otherCategory.trim();
          finalOtherCategory = formData.otherCategory.trim();
          console.log('DEBUG: Saving as custom category:', finalCategory);
        } else {
          finalCategory = 'Other';
          finalOtherCategory = '';
          console.log('DEBUG: Saving as "Other" without custom text');
        }
      } else {
        finalCategory = formData.category;
        finalOtherCategory = '';
        console.log('DEBUG: Saving as predefined category:', finalCategory);
      }
      
      const updatePayload = {
        name: formData.name,
        email: formData.email,
        avatar: formData.avatar,
        profile: {
          phone: formData.phone,
          countryCode: formData.countryCode,
          location: formData.location,
          nativeAddition: formData.nativeAddition,
          headline: formData.headline,
          bio: formData.bio,
          company: formData.company,
          position: formData.position,
          yearsOfExperience: formData.yearsOfExperience,
          category: finalCategory,
          otherCategory: finalOtherCategory,
          country: formData.country,
          skills: formData.skills,
          experience: formData.experience,
          education: formData.education,
          branch: formData.branch,
          avatar: formData.avatar,
          socialLinks: formData.socialLinks,
        }
      };

      console.log('DEBUG handleSaveProfile - Sending payload:', JSON.stringify(updatePayload, null, 2));

      const res = await axios.put(
        `${API_URL}/users/me`,
        updatePayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('DEBUG handleSaveProfile - Update response:', res.data);
      console.log('DEBUG handleSaveProfile - Updated category:', res.data.profile?.category);
      console.log('DEBUG handleSaveProfile - Updated otherCategory:', res.data.profile?.otherCategory);
      
      setUser(res.data);
      
      localStorage.setItem('userData', JSON.stringify({
        id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        membershipStatus: res.data.membershipStatus,
      }));

      alert('✅ Profile updated successfully!');
      setIsEditing(false);
      await fetchUserProfile();
    } catch (err) {
      console.error('Error updating profile:', err);
      console.error('Error response:', err.response?.data);
      alert(err.response?.data?.message || '❌ Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // If "Present"
    if (dateString.toLowerCase() === 'present') return 'Present';
    
    // If already in YYYY/MM format
    if (dateString.match(/^\d{4}\/\d{2}$/)) {
      const [year, month] = dateString.split('/');
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    
    // If in YYYY-MM format
    if (dateString.match(/^\d{4}-\d{2}$/)) {
      const [year, month] = dateString.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    
    // If full date
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    }
    
    return dateString; // Return as-is if can't parse
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const calculateProfileCompletion = () => {
    let score = 0;
    if (formData.name) score += 10;
    if (formData.email) score += 10;
    if (formData.phone) score += 10;
    if (formData.headline) score += 10;
    if (formData.bio) score += 10;
    if (formData.location) score += 5;
    if (formData.nativeAddition) score += 5;
    if (formData.category) score += 5;
    if (formData.country) score += 5;
    if (formData.skills.length > 0) score += 10;
    if (formData.experience.length > 0) score += 10;
    if (formData.education.length > 0) score += 10;
    return Math.min(score, 100);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
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
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-sm text-gray-600">View and manage your membership information</p>
              </div>
              <div className="flex items-center gap-3">
                {!isEditing ? (
                  <>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Profile verified
                    </button>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit profile
                    </button>
                  </>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      onClick={() => { 
                        fetchUserProfile(); 
                        setIsEditing(false);
                        setEditingExpIndex(null);
                        setEditingEduIndex(null);
                        setShowFromCalendar(false);
                        setShowToCalendar(false);
                      }}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-medium hover:bg-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-gray-600" />
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{formData.name}</div>
                    <div className="text-xs text-gray-500">
                      {(formData.category === 'Other' && formData.otherCategory) 
                        ? formData.otherCategory 
                        : formData.category || 'Civil Engineering'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Header Card */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt={formData.name}
                            className="w-20 h-20 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold ${formData.avatar ? 'hidden' : ''}`}>
                          {getInitials(formData.name)}
                        </div>
                        {isEditing && (
                          <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200">
                            <Camera className="w-3 h-3 text-gray-600" />
                          </button>
                        )}
                      </div>

                      {/* Name and Info */}
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="text-xl font-bold text-gray-900 mb-1 w-full border border-gray-300 rounded px-2 py-1"
                            placeholder="Your name"
                          />
                        ) : (
                          <h2 className="text-xl font-bold text-gray-900">{formData.name}</h2>
                        )}
                        
                        {isEditing ? (
                          <input
                            type="text"
                            name="headline"
                            value={formData.headline}
                            onChange={handleInputChange}
                            className="text-sm text-gray-600 w-full border border-gray-300 rounded px-2 py-1 mt-1"
                            placeholder="Professional headline"
                          />
                        ) : (
                          <p className="text-sm text-gray-600">
                            {formData.headline || `${(formData.category === 'Other' && formData.otherCategory) ? formData.otherCategory : formData.category} • Member since ${user?.createdAt ? new Date(user.createdAt).getFullYear() : '2023'}`}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-1">
                          {formData.position || 'Position'} • {formData.company || 'Company'} • {formData.location || 'Location'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Details */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Personal details</h3>
                    <span className="text-xs text-gray-500">Basic information linked to your membership</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Full name</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{formData.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Position</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="position"
                            value={formData.position}
                            onChange={handleInputChange}
                            className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Senior Engineer"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{formData.position || 'Not set'}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{formData.email}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Company</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., ABC Constructions"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{formData.company || 'Not set'}</p>
                        )}
                      </div>
                    </div>

                    {/* Native Addition */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Native Addition</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="nativeAddition"
                          value={formData.nativeAddition}
                          onChange={handleInputChange}
                          className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          placeholder="Native to be add under profile"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{formData.nativeAddition || 'Not set'}</p>
                      )}
                    </div>

                    {/* Category with Other option */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Category</label>
                      {isEditing ? (
                        <div>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 mb-2"
                          >
                            <option value="">Select Stream</option>
                            {categories.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                          
                          {formData.category === 'Other' && (
                            <div className="mt-2">
                              <input
                                type="text"
                                name="otherCategory"
                                value={formData.otherCategory}
                                onChange={handleInputChange}
                                placeholder="Please specify your profession/field"
                                className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Enter your specific profession/field (e.g., Data Science, Project Management, Environmental Engineering, etc.)
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-900">
                          {(formData.category === 'Other' && formData.otherCategory) 
                            ? formData.otherCategory 
                            : formData.category || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Country</label>
                      {isEditing ? (
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Country to be replace by Field</option>
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-gray-900">
                          {countries.find(c => c.code === formData.country)?.name || 'Not set'}
                        </p>
                      )}
                    </div>

                    {/* Phone with Country Code */}
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Phone</label>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <select
                            name="countryCode"
                            value={formData.countryCode}
                            onChange={handleInputChange}
                            className="w-32 text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          >
                            {countries.map((country) => (
                              <option key={country.code} value={country.dialCode}>
                                {country.dialCode} ({country.code})
                              </option>
                            ))}
                          </select>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="flex-1 text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="Phone - country code to add"
                          />
                        </div>
                      ) : (
                        <p className="text-sm text-gray-900">
                          {formData.countryCode && formData.phone ? `${formData.countryCode} ${formData.phone}` : 'Not set'}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Location</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., Bangalore, Karnataka"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{formData.location || 'Not set'}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Years of Experience</label>
                        {isEditing ? (
                          <input
                            type="text"
                            name="yearsOfExperience"
                            value={formData.yearsOfExperience}
                            onChange={handleInputChange}
                            className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 5 years"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">{formData.yearsOfExperience || 'Not set'}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Professional Summary</label>
                      {isEditing ? (
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full text-sm text-gray-900 border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{formData.bio || 'No bio added yet'}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Skills</h3>
                    <span className="text-xs text-gray-500">Highlight your top expertise</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {formData.skills.length > 0 ? (
                      formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {skill}
                          {isEditing && (
                            <button onClick={() => handleRemoveSkill(index)} className="hover:text-gray-900">
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))
                    ) : (
                      <div className="text-sm text-gray-500">No skills added yet</div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                        placeholder="Add a skill (e.g., Structural design, AutoCAD)"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleAddSkill}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>

                {/* Experience */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Experience</h3>
                    <span className="text-xs text-gray-500">Timeline of your professional journey</span>
                  </div>

                  <div className="space-y-4">
                    {formData.experience.length > 0 ? (
                      formData.experience.map((exp, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{exp.position}</h4>
                                <p className="text-sm text-gray-600">{exp.company}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(exp.from)} - {exp.to ? formatDate(exp.to) : 'Present'}
                                </p>
                                {exp.description && (
                                  <p className="text-sm text-gray-700 mt-2">{exp.description}</p>
                                )}
                              </div>
                              {isEditing && (
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleEditExperience(index)} 
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveExperience(index)} 
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No experience added yet</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {editingExpIndex !== null ? 'Edit Experience' : 'Add New Experience'}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={newExperience.position}
                          onChange={(e) => setNewExperience({...newExperience, position: e.target.value})}
                          placeholder="Position"
                          className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={newExperience.company}
                          onChange={(e) => setNewExperience({...newExperience, company: e.target.value})}
                          placeholder="Company"
                          className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        
                        {/* From Date with Calendar */}
                        <div className="relative">
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={newExperience.from}
                              onChange={(e) => {
                                const value = e.target.value;
                                // Allow only numbers and slash, max length 7 (YYYY/MM)
                                if (/^\d*\/?\d*$/.test(value) && value.length <= 7) {
                                  setNewExperience({...newExperience, from: value});
                                }
                              }}
                              placeholder="YYYY/MM"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500"
                              onBlur={(e) => {
                                // Validate and format on blur
                                const value = e.target.value;
                                if (value && /^\d{4}\/\d{2}$/.test(value)) {
                                  // Already in correct format
                                } else if (value) {
                                  // Try to auto-format
                                  const clean = value.replace(/\D/g, '');
                                  if (clean.length >= 6) {
                                    const year = clean.substring(0, 4);
                                    const month = clean.substring(4, 6);
                                    setNewExperience({...newExperience, from: `${year}/${month}`});
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setShowFromCalendar(!showFromCalendar);
                                setShowToCalendar(false);
                              }}
                              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r bg-gray-50 hover:bg-gray-100"
                            >
                              <Calendar className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          
                          {/* Calendar Picker for From Date */}
                          <CalendarPicker
                            isOpen={showFromCalendar}
                            date={fromCalendarDate}
                            onDateSelect={(date) => {
                              setNewExperience({...newExperience, from: date});
                              setShowFromCalendar(false);
                            }}
                            onClose={() => setShowFromCalendar(false)}
                          />
                        </div>

                        {/* To Date with Calendar */}
                        <div className="relative">
                          <div className="flex items-center">
                            <input
                              type="text"
                              value={newExperience.to}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*\/?\d*$/.test(value) && value.length <= 7) {
                                  setNewExperience({...newExperience, to: value});
                                }
                              }}
                              placeholder="YYYY/MM or Present"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-l focus:ring-2 focus:ring-blue-500"
                              onBlur={(e) => {
                                const value = e.target.value;
                                if (value && value.toLowerCase() === 'present') {
                                  setNewExperience({...newExperience, to: 'Present'});
                                } else if (value && /^\d{4}\/\d{2}$/.test(value)) {
                                  // Already in correct format
                                } else if (value) {
                                  const clean = value.replace(/\D/g, '');
                                  if (clean.length >= 6) {
                                    const year = clean.substring(0, 4);
                                    const month = clean.substring(4, 6);
                                    setNewExperience({...newExperience, to: `${year}/${month}`});
                                  }
                                }
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setShowToCalendar(!showToCalendar);
                                setShowFromCalendar(false);
                              }}
                              className="px-3 py-2 border border-l-0 border-gray-300 rounded-r bg-gray-50 hover:bg-gray-100"
                            >
                              <Calendar className="w-4 h-4 text-gray-600" />
                            </button>
                          </div>
                          
                          {/* Calendar Picker for To Date */}
                          <CalendarPicker
                            isOpen={showToCalendar}
                            date={toCalendarDate}
                            onDateSelect={(date) => {
                              setNewExperience({...newExperience, to: date});
                              setShowToCalendar(false);
                            }}
                            onClose={() => setShowToCalendar(false)}
                          />
                        </div>
                      </div>
                      <textarea
                        value={newExperience.description}
                        onChange={(e) => setNewExperience({...newExperience, description: e.target.value})}
                        placeholder="Description"
                        rows="2"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={editingExpIndex !== null ? handleUpdateExperience : handleAddExperience}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        {editingExpIndex !== null ? 'Update Experience' : 'Add Experience'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Education */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-semibold text-gray-900">Education</h3>
                    <span className="text-xs text-gray-500">Your academic background</span>
                  </div>

                  <div className="space-y-4">
                    {formData.education.length > 0 ? (
                      formData.education.map((edu, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b border-gray-200 last:border-0">
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 text-sm">{edu.degree}</h4>
                                <p className="text-sm text-gray-600">{edu.institution}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatDate(edu.from)} - {formatDate(edu.to)}
                                </p>
                              </div>
                              {isEditing && (
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleEditEducation(index)} 
                                    className="text-blue-600 hover:text-blue-700"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleRemoveEducation(index)} 
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No education added yet</p>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {editingEduIndex !== null ? 'Edit Education' : 'Add New Education'}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={newEducation.degree}
                          onChange={(e) => setNewEducation({...newEducation, degree: e.target.value})}
                          placeholder="Degree (e.g., B.E. Civil Engineering)"
                          className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={newEducation.institution}
                          onChange={(e) => setNewEducation({...newEducation, institution: e.target.value})}
                          placeholder="Institution"
                          className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={newEducation.from}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\/?\d*$/.test(value) && value.length <= 7) {
                              setNewEducation({...newEducation, from: value});
                            }
                          }}
                          placeholder="YYYY/MM"
                          className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (value && /^\d{4}\/\d{2}$/.test(value)) {
                              // Already in correct format
                            } else if (value) {
                              const clean = value.replace(/\D/g, '');
                              if (clean.length >= 6) {
                                const year = clean.substring(0, 4);
                                const month = clean.substring(4, 6);
                                setNewEducation({...newEducation, from: `${year}/${month}`});
                              }
                            }
                          }}
                        />
                        <input
                          type="text"
                          value={newEducation.to}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (/^\d*\/?\d*$/.test(value) && value.length <= 7) {
                              setNewEducation({...newEducation, to: value});
                            }
                          }}
                          placeholder="YYYY/MM"
                          className="px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                          onBlur={(e) => {
                            const value = e.target.value;
                            if (value && /^\d{4}\/\d{2}$/.test(value)) {
                              // Already in correct format
                            } else if (value) {
                              const clean = value.replace(/\D/g, '');
                              if (clean.length >= 6) {
                                const year = clean.substring(0, 4);
                                const month = clean.substring(4, 6);
                                setNewEducation({...newEducation, to: `${year}/${month}`});
                              }
                            }
                          }}
                        />
                      </div>
                      <button
                        onClick={editingEduIndex !== null ? handleUpdateEducation : handleAddEducation}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                      >
                        {editingEduIndex !== null ? 'Update Education' : 'Add Education'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Membership & Branch */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Membership & branch</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member ID</span>
                      <span className="font-medium text-gray-900">{user?.memberId || 'KEA-001'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Branch</span>
                      {isEditing ? (
                        <input
                          type="text"
                          name="branch"
                          value={formData.branch}
                          onChange={handleInputChange}
                          className="text-sm text-gray-900 border border-gray-300 rounded px-2 py-0.5 w-24"
                        />
                      ) : (
                        <span className="font-medium text-gray-900">{formData.branch}</span>
                      )}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status</span>
                      <span className="inline-flex items-center gap-1 text-green-600 font-medium">
                        <CheckCircle className="w-3 h-3" />
                        {user?.membershipStatus || 'Active'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined</span>
                      <span className="font-medium text-gray-900">
                        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Apr 2023'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Completion */}
                <div className="bg-white rounded-lg border border-gray-200 p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Profile completion</h3>
                  <p className="text-xs text-gray-600 mb-3">Building your network for your own search</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">{calculateProfileCompletion()}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${calculateProfileCompletion()}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    {calculateProfileCompletion() === 100 
                      ? 'Your profile is complete! Great job!' 
                      : 'Your profile is still incomplete. Add more information to reach 100%.'}
                  </p>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Complete profile
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
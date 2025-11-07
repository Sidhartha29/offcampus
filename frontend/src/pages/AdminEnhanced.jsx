import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { TrendingUp, Users, Calendar, MapPin, BarChart3, UserPlus, CheckCircle, XCircle, Shield, FileText, Clock } from 'lucide-react';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function AdminEnhanced({ user, onLogout }) {
  const [engagementData, setEngagementData] = useState(null);
  const [checkInData, setCheckInData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const [mentorStats, setMentorStats] = useState(null);
  const [pendingHolidays, setPendingHolidays] = useState([]);
  const [deletionRequests, setDeletionRequests] = useState([]);
  const [lowEngagers, setLowEngagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [assignMentorForm, setAssignMentorForm] = useState({ studentId: '', mentorId: '' });
  const [allStudents, setAllStudents] = useState([]);
  const [allMentors, setAllMentors] = useState([]);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', body: '', targetRole: 'all', type: 'general' });
  const [broadcastLoading, setBroadcastLoading] = useState(false);
  const [leisureRequests, setLeisureRequests] = useState([]);
  const [leisureAssignments, setLeisureAssignments] = useState({});

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [eng, checkins, users, bookings, mentors, holidays, deletions, engagers, leisure] = await Promise.all([
        api.get('/analytics/engagement?days=30'),
        api.get('/analytics/checkins?days=30'),
        api.get('/analytics/users'),
        api.get('/analytics/bookings?days=30'),
        api.get('/analytics/mentors'),
        api.get('/holiday/pending'),
        api.get('/admin/deletion-requests'),
        api.get('/admin/low-engagers'),
        api.get('/admin/leisure-requests?status=pending')
      ]);

      // Fetch users separately
      let studentsRes, mentorsRes;
      try {
        studentsRes = await api.get('/admin/users?role=student');
        mentorsRes = await api.get('/admin/users?role=mentor');
        setAllStudents(studentsRes.data.users || []);
        setAllMentors(mentorsRes.data.users || []);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }

      setEngagementData(eng.data);
      setCheckInData(checkins.data);
      setUserStats(users.data);
      setBookingStats(bookings.data);
      setMentorStats(mentors.data);
      setPendingHolidays(holidays.data.requests || []);
      setDeletionRequests(deletions.data.users || []);
      setLowEngagers(engagers.data.lowEngagers || []);
      setLeisureRequests(leisure.data.requests || []);
    } catch (error) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignMentor = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/assign-mentor', assignMentorForm);
      toast.success('Mentor assigned successfully!');
      setAssignMentorForm({ studentId: '', mentorId: '' });
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign mentor');
    }
  };

  const handleHolidayReview = async (requestId, status, comment = '') => {
    try {
      await api.patch(`/holiday/${requestId}/review`, { status, reviewComment: comment });
      toast.success(`Holiday request ${status} successfully`);
      fetchAllData();
    } catch (error) {
      toast.error('Failed to review request');
    }
  };

  const handleDeleteAccount = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this account?')) return;
    try {
      await api.delete(`/profile/${userId}`);
      toast.success('Account deleted successfully');
      fetchAllData();
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.body) {
      toast.error('Title and message are required');
      return;
    }

    setBroadcastLoading(true);
    try {
      const payload = {
        title: broadcastForm.title,
        body: broadcastForm.body,
        type: broadcastForm.type || 'general'
      };
      if (broadcastForm.targetRole && broadcastForm.targetRole !== 'all') {
        payload.targetRole = broadcastForm.targetRole;
      }

      await api.post('/notification/broadcast', payload);
      toast.success('Notification sent successfully');
      setBroadcastForm({ title: '', body: '', targetRole: 'all', type: 'general' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setBroadcastLoading(false);
    }
  };

  const handleLeisureApprove = async (requestId) => {
    try {
      await api.post(`/leisure/${requestId}/approve`, {
        assignedStudents: leisureAssignments[requestId] || []
      });
      toast.success('Leisure hours approved');
      setLeisureAssignments((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  };

  const handleLeisureReject = async (requestId) => {
    const adminNotes = window.prompt('Optional note to the mentor:') || '';
    try {
      await api.post(`/leisure/${requestId}/reject`, adminNotes ? { adminNotes } : {});
      toast.success('Leisure hours rejected');
      setLeisureAssignments((prev) => {
        const updated = { ...prev };
        delete updated[requestId];
        return updated;
      });
      fetchAllData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  };

  const toggleLeisureAssignment = (requestId, studentId) => {
    setLeisureAssignments((prev) => {
      const existing = prev[requestId] || [];
      const updated = existing.includes(studentId)
        ? existing.filter((id) => id !== studentId)
        : [...existing, studentId];
      return { ...prev, [requestId]: updated };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
        <Header user={user} onLogout={onLogout} />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-white/80">Complete platform management and analytics</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 bg-white/10 backdrop-blur rounded-lg p-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'dashboard' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('mentors')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'mentors' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'
            }`}
          >
            Mentor Management
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'notifications' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'
            }`}
          >
            Broadcast Alerts
          </button>
          <button
            onClick={() => setActiveTab('holidays')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'holidays' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'
            }`}
          >
            Holiday Requests ({pendingHolidays.length})
          </button>
          <button
            onClick={() => setActiveTab('leisure')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'leisure' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'
            }`}
          >
            Leisure Approvals ({leisureRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'users' ? 'bg-white text-purple-600' : 'text-white hover:bg-white/20'
            }`}
          >
            User Management
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Events</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {engagementData?.totalEvents || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Users</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {engagementData?.activeUsers || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {bookingStats?.dailyBookings?.reduce((sum, day) => sum + day.count, 0) || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Matches</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">
                      {mentorStats?.activeMatches || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <span>Daily Engagement</span>
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData?.dailyEngagement || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Event Types</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementData?.eventTypes || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {(engagementData?.eventTypes || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Check-ins</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={checkInData?.dailyCheckIns || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Users by Role</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={userStats?.usersByRole || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        {activeTab === 'mentors' && (
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-purple-600" />
                <span>Assign Mentor to Student</span>
              </h2>
              <form onSubmit={handleAssignMentor} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                  <select
                    required
                    value={assignMentorForm.studentId}
                    onChange={(e) => setAssignMentorForm({ ...assignMentorForm, studentId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Student</option>
                    {allStudents.map((s) => (
                      <option key={s._id} value={s.userId}>{s.name} ({s.userId})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mentor</label>
                  <select
                    required
                    value={assignMentorForm.mentorId}
                    onChange={(e) => setAssignMentorForm({ ...assignMentorForm, mentorId: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select Mentor</option>
                    {allMentors.map((m) => (
                      <option key={m._id} value={m.userId}>{m.name} ({m.userId})</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all"
                  >
                    Assign Mentor
                  </button>
                </div>
              </form>
            </div>

            {mentorStats?.topMentors && mentorStats.topMentors.length > 0 && (
              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Top Mentors</h2>
                <div className="space-y-3">
                  {mentorStats.topMentors.map((mentor, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{mentor.mentorName}</p>
                        <p className="text-sm text-gray-600">{mentor.mentorId}</p>
                      </div>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {mentor.menteeCount} mentees
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {lowEngagers.length > 0 && (
              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Low Engagement Students</h2>
                <div className="space-y-2">
                  {lowEngagers.map((student) => (
                    <div key={student._id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.userId}</p>
                      </div>
                      <span className="text-yellow-700 text-sm font-semibold">Needs Attention</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Send Platform Alert</h2>
              <form onSubmit={handleBroadcast} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={broadcastForm.body}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, body: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    placeholder="Share important updates, deadlines, or announcements"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Audience</label>
                    <select
                      value={broadcastForm.targetRole}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, targetRole: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Users</option>
                      <option value="student">Students</option>
                      <option value="mentor">Mentors</option>
                      <option value="admin">Admins</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                    <select
                      value={broadcastForm.type}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, type: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="general">General</option>
                      <option value="assignment">Assignment</option>
                      <option value="holiday">Holiday</option>
                      <option value="mentor">Mentor</option>
                      <option value="timetable">Timetable</option>
                      <option value="club">Club</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={broadcastLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all disabled:opacity-60"
                >
                  {broadcastLoading ? 'Sending...' : 'Send Notification'}
                </button>
              </form>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Tips</h2>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-purple-600">•</span>
                  <span>Use role targeting to deliver the right message to students, mentors, or admins.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-purple-600">•</span>
                  <span>Leverage notification types to group alerts on the dashboard.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-purple-600">•</span>
                  <span>Combine broadcast alerts with leisure approvals to keep mentees informed.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'holidays' && (
          <div className="space-y-4">
            {pendingHolidays.length === 0 ? (
              <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Pending Requests</h3>
              </div>
            ) : (
              pendingHolidays.map((request) => (
                <div key={request._id} className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-2">
                        Student: <span className="font-semibold">{request.student?.name || 'Unknown'}</span>
                      </p>
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-5 h-5 text-purple-600" />
                          <span className="font-semibold">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-2">{request.reason}</p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleHolidayReview(request._id, 'approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => {
                          const comment = prompt('Rejection reason (optional):');
                          handleHolidayReview(request._id, 'rejected', comment);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'leisure' && (
          <div className="space-y-4">
            {leisureRequests.length === 0 ? (
              <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Pending Leisure Requests</h3>
                <p className="text-gray-600">Mentors are up to date with their schedules.</p>
              </div>
            ) : (
              leisureRequests.map((request) => (
                <div key={request._id} className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Mentor</p>
                      <h3 className="text-lg font-bold text-gray-800">{request.mentor?.name || request.mentor?.userId}</h3>
                      <p className="text-sm text-gray-500 mb-2">{request.mentor?.userId}</p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="font-semibold flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          {new Date(request.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-purple-600" />
                          {request.startTime} - {request.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Assign Students for Sessions</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-44 overflow-y-auto p-3 border border-gray-200 rounded-lg bg-gray-50">
                        {allStudents.length === 0 ? (
                          <p className="text-sm text-gray-500">No students available to assign.</p>
                        ) : (
                          allStudents.map((student) => (
                            <label key={student._id} className="flex items-center space-x-2 text-sm text-gray-700">
                              <input
                                type="checkbox"
                                className="rounded text-purple-600 focus:ring-purple-500"
                                checked={(leisureAssignments[request._id] || []).includes(student._id)}
                                onChange={() => toggleLeisureAssignment(request._id, student._id)}
                              />
                              <span className="truncate">
                                {student.name}
                                <span className="text-gray-400"> ({student.userId})</span>
                              </span>
                            </label>
                          ))
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">Select the students who should receive timetable slots during this leisure window.</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                    <button
                      onClick={() => handleLeisureApprove(request._id)}
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Approve & Notify</span>
                    </button>
                    <button
                      onClick={() => handleLeisureReject(request._id)}
                      className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {deletionRequests.length > 0 && (
              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-red-600" />
                  <span>Account Deletion Requests ({deletionRequests.length})</span>
                </h2>
                <div className="space-y-3">
                  {deletionRequests.map((req) => (
                    <div key={req._id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-800">{req.name}</p>
                        <p className="text-sm text-gray-600">{req.email} - {req.userId}</p>
                        <p className="text-xs text-gray-500">
                          Requested: {new Date(req.deletedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteAccount(req._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                      >
                        Delete Account
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">All Users</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userStats?.usersByRole?.map((role) => (
                  <div key={role._id} className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-gray-800">{role.count}</p>
                    <p className="text-gray-600 capitalize">{role._id}s</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEnhanced;


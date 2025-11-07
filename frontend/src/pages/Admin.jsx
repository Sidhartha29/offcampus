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
import { TrendingUp, Users, Calendar, MapPin, BarChart3 } from 'lucide-react';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function Admin({ user, onLogout }) {
  const [engagementData, setEngagementData] = useState(null);
  const [checkInData, setCheckInData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [bookingStats, setBookingStats] = useState(null);
  const [mentorStats, setMentorStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      const [eng, checkins, users, bookings, mentors] = await Promise.all([
        api.get('/analytics/engagement?days=30'),
        api.get('/analytics/checkins?days=30'),
        api.get('/analytics/users'),
        api.get('/analytics/bookings?days=30'),
        api.get('/analytics/mentors')
      ]);

      setEngagementData(eng.data);
      setCheckInData(checkins.data);
      setUserStats(users.data);
      setBookingStats(bookings.data);
      setMentorStats(mentors.data);
    } catch (error) {
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
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
          <p className="text-white/80">Analytics and insights for your platform</p>
        </div>

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
          {/* Daily Engagement Chart */}
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

          {/* Event Types Distribution */}
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

          {/* Daily Check-ins */}
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

          {/* Users by Role */}
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

          {/* Bookings by Resource */}
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Bookings by Resource</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingStats?.bookingsByResource || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Users by Year */}
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Students by Year</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userStats?.usersByYear || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Stats Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Mentors */}
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

          {/* Check-in Distance Stats */}
          {checkInData?.distanceStats && (
            <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Check-in Distance Stats</h2>
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Average Distance</span>
                  <span className="font-semibold text-gray-800">
                    {checkInData.distanceStats.avgDistance
                      ? `${(checkInData.distanceStats.avgDistance / 1000).toFixed(2)} km`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Max Distance</span>
                  <span className="font-semibold text-gray-800">
                    {checkInData.distanceStats.maxDistance
                      ? `${(checkInData.distanceStats.maxDistance / 1000).toFixed(2)} km`
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Min Distance</span>
                  <span className="font-semibold text-gray-800">
                    {checkInData.distanceStats.minDistance
                      ? `${(checkInData.distanceStats.minDistance / 1000).toFixed(2)} km`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;


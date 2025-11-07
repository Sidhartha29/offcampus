import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import { Users, BookOpen, Calendar, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function MentorDashboard({ user, onLogout }) {
  const [mentees, setMentees] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalMentees: 0,
    totalAssignments: 0,
    pendingGradings: 0,
    upcomingSessions: 0
  });
  const [loading, setLoading] = useState(true);
  const [notifyForm, setNotifyForm] = useState({ title: '', body: '', mentees: [] });
  const [notifyLoading, setNotifyLoading] = useState(false);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [menteesRes, assignmentsRes, sessionsRes] = await Promise.all([
        api.get('/mentor/my-mentees'),
        api.get('/assignment'),
        api.get('/session')
      ]);

      setMentees(menteesRes.data.mentees || []);
      setAssignments(assignmentsRes.data.assignments || []);
      setSessions(sessionsRes.data.sessions || []);

      // Calculate stats
      const pendingGradings = assignmentsRes.data.assignments?.reduce((sum, a) => {
        return sum + (a.submissions?.filter(s => s.status !== 'graded').length || 0);
      }, 0) || 0;

      const upcomingSessions = sessionsRes.data.sessions?.filter(s => 
        s.status === 'scheduled' && new Date(s.date) >= new Date()
      ).length || 0;

      setStats({
        totalMentees: menteesRes.data.mentees?.length || 0,
        totalAssignments: assignmentsRes.data.assignments?.length || 0,
        pendingGradings,
        upcomingSessions
      });
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const toggleMenteeSelection = (menteeUserId) => {
    setNotifyForm((prev) => {
      const exists = prev.mentees.includes(menteeUserId);
      return {
        ...prev,
        mentees: exists ? prev.mentees.filter((id) => id !== menteeUserId) : [...prev.mentees, menteeUserId]
      };
    });
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!notifyForm.title || !notifyForm.body) {
      toast.error('Title and message are required');
      return;
    }

    setNotifyLoading(true);
    try {
      await api.post('/notification/mentor-message', {
        title: notifyForm.title,
        body: notifyForm.body,
        studentIds: notifyForm.mentees
      });
      toast.success('Notification sent to mentees');
      setNotifyForm({ title: '', body: '', mentees: [] });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification');
    } finally {
      setNotifyLoading(false);
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
          <h1 className="text-4xl font-bold text-white mb-2">Mentor Dashboard</h1>
          <p className="text-white/80">Welcome back, {user?.name}! Manage your mentees and activities</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Mentees</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalMentees}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Assignments</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalAssignments}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Pending Gradings</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pendingGradings}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Upcoming Sessions</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{stats.upcomingSessions}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/assignments"
            className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg hover:bg-white transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Manage Assignments</h3>
                <p className="text-sm text-gray-600">Create and grade assignments</p>
              </div>
            </div>
          </Link>

          <Link
            to="/sessions"
            className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg hover:bg-white transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">View Sessions</h3>
                <p className="text-sm text-gray-600">Manage mentor sessions</p>
              </div>
            </div>
          </Link>

          <Link
            to="/mentor"
            className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg hover:bg-white transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">My Mentees</h3>
                <p className="text-sm text-gray-600">View all assigned students</p>
              </div>
            </div>
          </Link>
        </div>

        {mentees.length > 0 && (
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Notify Mentees</h2>
            <form onSubmit={handleSendNotification} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    required
                    value={notifyForm.title}
                    onChange={(e) => setNotifyForm({ ...notifyForm, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Mentees</label>
                  <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    {mentees.map((mentee) => (
                      <label key={mentee._id || mentee.userId} className="flex items-center space-x-2 text-sm text-gray-700 mb-1">
                        <input
                          type="checkbox"
                          className="rounded text-purple-600 focus:ring-purple-500"
                          checked={notifyForm.mentees.includes(mentee.userId)}
                          onChange={() => toggleMenteeSelection(mentee.userId)}
                        />
                        <span className="truncate">{mentee.name} <span className="text-gray-400">({mentee.userId})</span></span>
                      </label>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Leave all unchecked to notify every mentee.</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  rows={4}
                  required
                  value={notifyForm.body}
                  onChange={(e) => setNotifyForm({ ...notifyForm, body: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Share updates, reminders, or feedback"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={notifyLoading}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all disabled:opacity-60"
                >
                  {notifyLoading ? 'Sending...' : 'Send Notification'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Sessions */}
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Sessions</h2>
            {sessions.filter(s => s.status === 'scheduled' && new Date(s.date) >= new Date()).length === 0 ? (
              <p className="text-gray-600">No upcoming sessions</p>
            ) : (
              <div className="space-y-3">
                {sessions
                  .filter(s => s.status === 'scheduled' && new Date(s.date) >= new Date())
                  .slice(0, 5)
                  .map((session) => (
                    <div key={session._id} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-semibold text-gray-800">{session.student?.name}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(session.date).toLocaleDateString()} at {session.time}
                      </p>
                      {session.topic && (
                        <p className="text-xs text-gray-500 mt-1">Topic: {session.topic}</p>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Pending Gradings */}
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Gradings</h2>
            {stats.pendingGradings === 0 ? (
              <p className="text-gray-600">No pending gradings</p>
            ) : (
              <div className="space-y-3">
                {assignments
                  .flatMap(a => 
                    (a.submissions || [])
                      .filter(s => s.status !== 'graded')
                      .map(s => ({ assignment: a, submission: s }))
                  )
                  .slice(0, 5)
                  .map((item, idx) => (
                    <div key={idx} className="p-3 bg-yellow-50 rounded-lg">
                      <p className="font-semibold text-gray-800">{item.assignment.title}</p>
                      <p className="text-sm text-gray-600">
                        Student: {item.submission.student?.name || 'Unknown'}
                      </p>
                      <Link
                        to="/assignments"
                        className="text-xs text-purple-600 hover:text-purple-700 mt-1 inline-block"
                      >
                        Grade now →
                      </Link>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MentorDashboard;


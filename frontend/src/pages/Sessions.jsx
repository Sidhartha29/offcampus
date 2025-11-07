import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import { Calendar, Plus, Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

function Sessions({ user, onLogout }) {
  const [sessions, setSessions] = useState([]);
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: 60,
    topic: '',
    location: 'Online'
  });

  useEffect(() => {
    fetchSessions();
    if (user?.role === 'student') {
      fetchMentor();
    }
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/session');
      setSessions(response.data.sessions || []);
    } catch (error) {
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentor = async () => {
    try {
      const response = await api.get('/mentor/my-mentor');
      if (response.data?.mentor) {
        setMentor(response.data.mentor);
      } else {
        setMentor(null);
      }
    } catch (error) {
      setMentor(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!mentor?._id) {
      toast.error('You need to have a mentor assigned first');
      return;
    }

    try {
      await api.post('/session', {
        ...formData,
        mentorId: mentor._id
      });
      toast.success('Session scheduled successfully!');
      setShowForm(false);
      setFormData({ date: '', time: '', duration: 60, topic: '', location: 'Online' });
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to schedule session');
    }
  };

  const handleStatusUpdate = async (sessionId, status, notes = '') => {
    try {
      await api.patch(`/session/${sessionId}/status`, { status, notes });
      toast.success('Session updated successfully!');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to update session');
    }
  };

  const handleAccept = async (sessionId) => {
    try {
      await api.post(`/session/${sessionId}/accept`);
      toast.success('Session request accepted');
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to accept session');
    }
  };

  const handleReject = async (sessionId) => {
    const notes = window.prompt('Optional note for the student:') || '';
    try {
      await api.post(`/session/${sessionId}/reject`, notes ? { notes } : {});
      toast.success('Session request rejected');
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reject session');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Mentor Sessions</h1>
            <p className="text-white/80">
              {user?.role === 'student' ? 'Schedule sessions with your mentor' : 'Manage sessions with your mentees'}
            </p>
          </div>
          {user?.role === 'student' && mentor && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Schedule Session</span>
            </button>
          )}
        </div>

        {showForm && user?.role === 'student' && (
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Schedule New Session</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Online or physical location"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  placeholder="What would you like to discuss?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all"
                >
                  Schedule Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Sessions</h3>
            <p className="text-gray-600">
              {user?.role === 'student' ? 'Schedule your first session with your mentor' : 'No sessions scheduled yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session._id} className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <Calendar className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-bold text-gray-800">
                        {user?.role === 'student' 
                          ? `Session with ${session.mentor?.name || 'Mentor'}`
                          : `Session with ${session.student?.name || 'Student'}`
                        }
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        session.status === 'completed' ? 'bg-green-100 text-green-700' :
                        session.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {session.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(session.date).toLocaleDateString()} at {session.time}</span>
                        <span>({session.duration} minutes)</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{session.location}</span>
                      </div>
                      {session.topic && (
                        <p className="text-gray-800"><span className="font-semibold">Topic:</span> {session.topic}</p>
                      )}
                      {session.status === 'requested' && user?.role === 'student' && (
                        <p className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 px-3 py-2 rounded-lg">
                          Waiting for mentor approval
                        </p>
                      )}
                      {session.notes && (
                        <p className="text-gray-800"><span className="font-semibold">Notes:</span> {session.notes}</p>
                      )}
                    </div>
                  </div>
                  {(session.status === 'requested' || session.status === 'scheduled') && (
                    <div className="flex space-x-2 ml-4">
                      {user?.role === 'mentor' && session.status === 'requested' && (
                        <>
                          <button
                            onClick={() => handleAccept(session._id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Accept</span>
                          </button>
                          <button
                            onClick={() => handleReject(session._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center space-x-2"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}
                      {user?.role === 'mentor' && session.status === 'scheduled' && (
                        <>
                          <button
                            onClick={() => {
                              const notes = prompt('Session notes:');
                              handleStatusUpdate(session._id, 'completed', notes);
                            }}
                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center space-x-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Complete</span>
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(session._id, 'cancelled')}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center space-x-2"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </>
                      )}
                      {user?.role === 'student' && session.status === 'scheduled' && (
                        <button
                          onClick={() => handleStatusUpdate(session._id, 'cancelled')}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center space-x-2"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Sessions;


import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import { Users, Plus, Calendar, MapPin } from 'lucide-react';

function Clubs({ user, onLogout }) {
  const [clubs, setClubs] = useState([]);
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchClubs();
    if (user?.role === 'student') {
      fetchMyClubs();
    }
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await api.get('/club');
      setClubs(response.data.clubs || []);
    } catch (error) {
      toast.error('Failed to load clubs');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyClubs = async () => {
    try {
      const response = await api.get('/club/my/memberships');
      setMyClubs(response.data.clubs || []);
    } catch (error) {
      console.error('Failed to load my clubs');
    }
  };

  const handleJoin = async (clubId) => {
    try {
      await api.post(`/club/${clubId}/join`);
      toast.success('Successfully joined club!');
      fetchClubs();
      fetchMyClubs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join club');
    }
  };

  const handleLeave = async (clubId) => {
    if (!window.confirm('Are you sure you want to leave this club?')) return;
    try {
      await api.post(`/club/${clubId}/leave`);
      toast.success('Left club successfully');
      fetchClubs();
      fetchMyClubs();
    } catch (error) {
      toast.error('Failed to leave club');
    }
  };

  const displayClubs = activeTab === 'my' ? myClubs : clubs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Student Clubs</h1>
          <p className="text-white/80">Join clubs and connect with peers</p>
        </div>

        {user?.role === 'student' && (
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              All Clubs
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                activeTab === 'my'
                  ? 'bg-white text-purple-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              My Clubs ({myClubs.length})
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : displayClubs.length === 0 ? (
          <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Clubs Available</h3>
            <p className="text-gray-600">Check back later for new clubs</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayClubs.map((club) => {
              const isMember = myClubs.some(c => c._id === club._id);
              return (
                <div key={club._id} className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{club.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{club.description}</p>
                      <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {club.category}
                      </span>
                    </div>
                  </div>

                  {club.meetingSchedule && (
                    <div className="space-y-2 mb-4 text-sm text-gray-600">
                      {club.meetingSchedule.day && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{club.meetingSchedule.day} at {club.meetingSchedule.time}</span>
                        </div>
                      )}
                      {club.meetingSchedule.location && (
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{club.meetingSchedule.location}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {user?.role === 'student' && (
                    <button
                      onClick={() => isMember ? handleLeave(club._id) : handleJoin(club._id)}
                      className={`w-full py-2 rounded-lg font-semibold transition-all ${
                        isMember
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:from-purple-600 hover:to-blue-700'
                      }`}
                    >
                      {isMember ? 'Leave Club' : 'Join Club'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Clubs;


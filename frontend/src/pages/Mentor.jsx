import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import MentorCard from '../components/MentorCard';
import { Users, UserCheck, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

function Mentor({ user, onLogout }) {
  const [mentor, setMentor] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'student') {
      // Students can request/view their mentor
      fetchMentor();
    } else if (user?.role === 'mentor') {
      // Mentors can view their mentees
      fetchMentees();
    }
  }, [user]);

  const fetchMentor = async () => {
    try {
      const response = await api.get('/mentor/my-mentor');
      if (response.data.mentor) {
        setMentor(response.data.mentor);
      }
    } catch (error) {
      // Mentor might not be assigned yet
      console.log('No mentor assigned');
    } finally {
      setLoading(false);
    }
  };

  const fetchMentees = async () => {
    try {
      const response = await api.get('/mentor/my-mentees');
      setMentees(response.data.mentees || []);
    } catch (error) {
      toast.error('Failed to load mentees');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestMentor = async () => {
    try {
      const response = await api.post('/mentor/request');
      setMentor(response.data);
      toast.success(`Mentor assigned: ${response.data.mentorName}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request mentor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user?.role === 'student' ? (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">My Mentor</h1>
              <p className="text-white/80">Connect with your assigned mentor</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : mentor ? (
              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <MentorCard mentor={mentor} />
                <div className="mt-4 flex space-x-4">
                  <Link
                    to="/sessions"
                    className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all text-center"
                  >
                    Schedule Session
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Mentor Assigned</h3>
                <p className="text-gray-600 mb-6">Request a mentor to get personalized support</p>
                <button
                  onClick={handleRequestMentor}
                  className="bg-gradient-to-r from-purple-500 to-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all flex items-center space-x-2 mx-auto"
                >
                  <UserCheck className="w-5 h-5" />
                  <span>Request Mentor</span>
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">My Mentees</h1>
              <p className="text-white/80">Students assigned to you</p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            ) : mentees.length === 0 ? (
              <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
                <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Mentees Yet</h3>
                <p className="text-gray-600">Students will be assigned to you as they request mentors</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mentees.map((mentee) => (
                  <div key={mentee._id} className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {mentee.name?.charAt(0).toUpperCase() || 'S'}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{mentee.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">ID: {mentee.userId}</p>
                        {mentee.profile?.college && (
                          <p className="text-sm text-gray-600">{mentee.profile.college}</p>
                        )}
                        {mentee.profile?.year && (
                          <p className="text-sm text-gray-600">Year {mentee.profile.year}</p>
                        )}
                        {mentee.profile?.homeTown && (
                          <p className="text-sm text-gray-600">From: {mentee.profile.homeTown}</p>
                        )}
                      </div>
                    </div>
                    {user?.role === 'admin' && (
                      <div className="mt-4 flex space-x-2">
                        <Link
                          to={`/admin/student-performance/${mentee.userId}`}
                          className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all text-center text-sm"
                        >
                          View Performance
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Mentor;



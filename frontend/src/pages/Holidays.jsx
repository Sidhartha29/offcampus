import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import { Calendar, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';

function Holidays({ user, onLogout }) {
  const [requests, setRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    if (user?.role === 'student') {
      fetchMyRequests();
    } else if (user?.role === 'admin') {
      fetchPendingRequests();
    }
  }, [user]);

  const fetchMyRequests = async () => {
    try {
      const response = await api.get('/holiday/my');
      setRequests(response.data.requests || []);
    } catch (error) {
      toast.error('Failed to load holiday requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await api.get('/holiday/pending');
      setPendingRequests(response.data.requests || []);
    } catch (error) {
      toast.error('Failed to load pending requests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/holiday', formData);
      toast.success('Holiday request submitted successfully!');
      setShowForm(false);
      setFormData({ startDate: '', endDate: '', reason: '' });
      fetchMyRequests();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleReview = async (requestId, status, comment = '') => {
    try {
      await api.patch(`/holiday/${requestId}/review`, { status, reviewComment: comment });
      toast.success(`Request ${status} successfully`);
      fetchPendingRequests();
    } catch (error) {
      toast.error('Failed to review request');
    }
  };

  const displayRequests = user?.role === 'admin' ? pendingRequests : requests;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {user?.role === 'admin' ? 'Holiday Requests' : 'My Holiday Requests'}
            </h1>
            <p className="text-white/80">
              {user?.role === 'admin' ? 'Review and approve holiday requests' : 'Request time off from campus'}
            </p>
          </div>
          {user?.role === 'student' && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center space-x-2 shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>New Request</span>
            </button>
          )}
        </div>

        {showForm && user?.role === 'student' && (
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Request Holiday</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <textarea
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Please provide a reason for your holiday request..."
                />
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all"
                >
                  Submit Request
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
        ) : displayRequests.length === 0 ? (
          <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Requests</h3>
            <p className="text-gray-600">
              {user?.role === 'admin' ? 'No pending holiday requests' : 'You have no holiday requests'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayRequests.map((request) => (
              <div key={request._id} className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {user?.role === 'admin' && (
                      <p className="text-sm text-gray-600 mb-2">
                        Student: <span className="font-semibold">{request.student?.name || 'Unknown'}</span>
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mb-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold">
                          {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'approved' ? 'bg-green-100 text-green-700' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{request.reason}</p>
                    {request.reviewComment && (
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Admin Comment:</span> {request.reviewComment}
                      </p>
                    )}
                  </div>
                  {user?.role === 'admin' && request.status === 'pending' && (
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleReview(request._id, 'approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => {
                          const comment = prompt('Rejection reason (optional):');
                          handleReview(request._id, 'rejected', comment);
                        }}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
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

export default Holidays;


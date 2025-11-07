import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import { TrendingUp, CheckCircle, BookOpen, Calendar, BarChart3 } from 'lucide-react';
import { useParams } from 'react-router-dom';

function StudentPerformance({ user, onLogout }) {
  const { studentId } = useParams();
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchPerformance();
    }
  }, [studentId]);

  const fetchPerformance = async () => {
    try {
      const response = await api.get(`/admin/student-performance/${studentId}`);
      setPerformance(response.data);
    } catch (error) {
      toast.error('Failed to load performance data');
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

  if (!performance) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
        <Header user={user} onLogout={onLogout} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/90 backdrop-blur rounded-xl p-12 text-center shadow-lg">
            <p className="text-gray-600">Student not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
      <Header user={user} onLogout={onLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Performance Report: {performance.student.name}
          </h1>
          <p className="text-white/80">Student ID: {performance.student.userId}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Engagements</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {performance.performance.totalEngagements}
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
                <p className="text-gray-600 text-sm font-medium">Check-ins</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {performance.performance.totalCheckIns}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Assignments</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {performance.performance.assignmentsSubmitted}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Sessions</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {performance.performance.sessionsCompleted}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Student Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">College</p>
              <p className="font-semibold text-gray-800">
                {performance.student.profile?.college || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Year</p>
              <p className="font-semibold text-gray-800">
                {performance.student.profile?.year || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Home Town</p>
              <p className="font-semibold text-gray-800">
                {performance.student.profile?.homeTown || 'Not specified'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Commuting</p>
              <p className="font-semibold text-gray-800">
                {performance.student.profile?.commuting ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentPerformance;


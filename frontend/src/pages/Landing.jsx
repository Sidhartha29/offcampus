import { Link } from 'react-router-dom';
import { GraduationCap, UserCheck, Shield, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';

function Landing() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Invalid user data
      }
    }
  }, []);

  // If user is logged in, show only their role's features
  const showStudent = !user || user.role === 'student';
  const showMentor = !user || user.role === 'mentor';
  const showAdmin = !user || user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Off-Campus Student Support Platform
          </h1>
          <p className="text-lg sm:text-xl text-white/90 mb-8">
            Your comprehensive solution for campus life management
          </p>
        </div>

        <div className={`grid grid-cols-1 ${showStudent && showMentor && showAdmin ? 'md:grid-cols-3' : showStudent && showMentor ? 'md:grid-cols-2' : ''} gap-6 sm:gap-8 mb-8 sm:mb-12`}>
          {/* Student Landing */}
          {showStudent && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">For Students</h2>
            <ul className="space-y-3 mb-6 text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Manage your schedule</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Book campus resources</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Join student clubs</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Submit assignments</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Request holidays</span>
              </li>
            </ul>
            <Link
              to="/register"
              className="block w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all text-center flex items-center justify-center space-x-2"
            >
              <span>Sign Up as Student</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="block w-full mt-3 text-center text-purple-600 font-semibold hover:text-purple-700"
            >
              Already have an account? Sign in
            </Link>
          </div>
          )}

          {/* Mentor Landing */}
          {showMentor && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">For Mentors</h2>
            <ul className="space-y-3 mb-6 text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Manage mentees</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Create assignments</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Evaluate submissions</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Schedule sessions</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Track engagement</span>
              </li>
            </ul>
            <Link
              to="/register"
              className="block w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-teal-700 transition-all text-center flex items-center justify-center space-x-2"
            >
              <span>Sign Up as Mentor</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="block w-full mt-3 text-center text-green-600 font-semibold hover:text-green-700"
            >
              Already have an account? Sign in
            </Link>
          </div>
          )}

          {/* Admin Landing */}
          {showAdmin && (
          <div className="bg-white/90 backdrop-blur rounded-2xl p-6 sm:p-8 shadow-xl">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">For Administrators</h2>
            <ul className="space-y-3 mb-6 text-gray-600">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Analytics dashboard</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Assign mentors</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Approve requests</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Performance reports</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Manage users</span>
              </li>
            </ul>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800 text-center">
                Admin access is restricted. Contact system administrator.
              </p>
            </div>
            <Link
              to="/login"
              className="block w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-red-600 hover:to-orange-700 transition-all text-center flex items-center justify-center space-x-2"
            >
              <span>Admin Login</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          )}
        </div>

        {!user && (
        <div className="text-center">
          <p className="text-white/80 mb-4">Ready to get started?</p>
          <Link
            to="/login"
            className="inline-block bg-white text-purple-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm sm:text-base"
          >
            Sign In to Your Account
          </Link>
        </div>
        )}
        {user && (
        <div className="text-center">
          <Link
            to={user.role === 'admin' ? '/admin' : user.role === 'mentor' ? '/mentor' : '/dashboard'}
            className="inline-block bg-white text-purple-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm sm:text-base"
          >
            Go to Dashboard
          </Link>
        </div>
        )}
      </div>
    </div>
  );
}

export default Landing;


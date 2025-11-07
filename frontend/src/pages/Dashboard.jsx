import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import Header from '../components/Header';
import TimetableCard from '../components/TimetableCard';
import NotificationCard from '../components/NotificationCard';
import { MapPin, CheckCircle, Calendar, TrendingUp, Users, Map } from 'lucide-react';

function Dashboard({ user, onLogout }) {
  const [schedule, setSchedule] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [checkInDistance, setCheckInDistance] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
    getCurrentLocation();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard');
      setSchedule(response.data.schedule);
      setAlerts(response.data.alerts || []);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          
          // Update user location in backend
          try {
            await api.post('/location/update', { latitude, longitude });
          } catch (error) {
            console.error('Failed to update location:', error);
          }

          // Find nearby users
          try {
            const response = await api.get(`/location/users/nearby?lat=${latitude}&lng=${longitude}&radius=5000`);
            setNearbyUsers(response.data.users || []);
          } catch (error) {
            console.error('Failed to fetch nearby users:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          toast.error('Unable to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
    }
  };

  const handleCheckIn = async () => {
    if (!location) {
      toast.error('Location not available');
      return;
    }

    // Campus coordinates - Update these with your actual campus coordinates
    // You can get these from Google Maps by right-clicking on your campus location
    const campusLat = 16.2345; // Example: Bangalore - UPDATE THIS
    const campusLng = 80.5613; // Example: Bangalore - UPDATE THIS

    try {
      const response = await api.post('/checkin', {
        campusLat,
        campusLng,
        deviceLat: location.latitude,
        deviceLng: location.longitude
      });
      
      setCheckInDistance(response.data.distance);
      const message = response.data.isNearCampus 
        ? `Check-in successful! You are near campus (${response.data.distanceKm} km away)`
        : `Check-in recorded. You are ${response.data.distanceKm} km from campus.`;
      toast.success(message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Check-in failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-blue-600">
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
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-white/80">Here's what's happening today</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Today's Schedule</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {schedule?.slots?.length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Notifications</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{alerts.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Nearby Users</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{nearbyUsers.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Distance from Campus</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">
                  {checkInDistance ? `${(checkInDistance / 1000).toFixed(2)} km` : '--'}
                </p>
                {checkInDistance && (
                  <p className="text-xs text-gray-500 mt-1">
                    {checkInDistance <= 500 ? '✓ Near Campus' : '⚠ Far from Campus'}
                  </p>
                )}
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Check-in Section */}
            <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
                  <Map className="w-5 h-5 text-purple-600" />
                  <span>Location & Check-in</span>
                </h2>
              </div>
              
              {location ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Your Current Location</p>
                    <p className="font-mono text-sm mb-2">
                      Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                    </p>
                    {checkInDistance && (
                      <div className="mt-2 p-2 bg-blue-50 rounded">
                        <p className="text-xs text-blue-700">
                          <span className="font-semibold">Distance:</span> {checkInDistance.toFixed(0)} meters
                          ({checkInDistance <= 500 ? 'Within campus range' : 'Outside campus range'})
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleCheckIn}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Check In to Campus</span>
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Campus coordinates: 12.9716°N, 77.5946°E (Update in Dashboard.jsx)
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={getCurrentLocation}
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                  >
                    Enable Location Services
                  </button>
                  <p className="text-xs text-gray-500 text-center">
                    Location access is required for check-in functionality
                  </p>
                </div>
              )}

              {nearbyUsers.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Nearby Users (within 5km)</p>
                  <div className="space-y-2">
                    {nearbyUsers.slice(0, 5).map((nearbyUser, idx) => (
                      <div key={idx} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {nearbyUser.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{nearbyUser.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{nearbyUser.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Timetable */}
            {schedule && (
              <TimetableCard schedule={schedule} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            {alerts.length > 0 && (
              <div className="bg-white/90 backdrop-blur rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Alerts</h2>
                <div className="space-y-3">
                  {alerts.map((alert, idx) => (
                    <NotificationCard key={idx} notification={alert} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


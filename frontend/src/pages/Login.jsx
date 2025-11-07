import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { LogIn, Mail, Lock } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';
import { SiMicrosoft } from 'react-icons/si';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('password');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!otpSent || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const navigateByRole = (user) => {
    if (user.role === 'admin') {
      navigate('/admin', { replace: true });
    } else if (user.role === 'mentor') {
      navigate('/mentor', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      const { token, user } = response.data;
      
      onLogin(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigateByRole(user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!formData.email) {
      toast.error('Please enter your email first');
      return;
    }

    setOtpLoading(true);
    try {
      const { data } = await api.post('/otp/request', { email: formData.email });
      setOtpSent(true);
      setCountdown(60);
      toast.success('OTP sent to your email');
      if (data?.otp && import.meta.env?.DEV) {
        toast.success(`Test OTP: ${data.otp}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!formData.email || !otp) {
      toast.error('Email and OTP are required');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/otp/verify', {
        email: formData.email,
        otp,
        password: formData.password || undefined
      });

      const { token, user } = response.data;
      onLogin(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigateByRole(user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // In production, use Google OAuth SDK
      // For now, we'll use a mock approach - you can integrate Google OAuth SDK
      toast.info('Google OAuth integration - Use Google OAuth SDK in production');
      
      // Example: After getting Google token from SDK
      // const googleUser = await getGoogleUser(); // From Google OAuth SDK
      // const response = await api.post('/oauth/google', {
      //   email: googleUser.email,
      //   name: googleUser.name,
      //   googleId: googleUser.id,
      //   picture: googleUser.picture
      // });
      // onLogin(response.data.user, response.data.token);
    } catch (error) {
      toast.error('Google login failed');
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      // In production, use Microsoft OAuth SDK
      toast.info('Microsoft OAuth integration - Use Microsoft OAuth SDK in production');
      
      // Example: After getting Microsoft token from SDK
      // const msUser = await getMicrosoftUser(); // From Microsoft OAuth SDK
      // const response = await api.post('/oauth/microsoft', {
      //   email: msUser.email,
      //   name: msUser.name,
      //   microsoftId: msUser.id,
      //   picture: msUser.picture
      // });
      // onLogin(response.data.user, response.data.token);
    } catch (error) {
      toast.error('Microsoft login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <div className="grid grid-cols-2 gap-2 bg-gray-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setOtp('');
                setOtpSent(false);
              }}
              className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                authMode === 'password' ? 'bg-white shadow text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Password Login
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('otp');
                setFormData((prev) => ({ ...prev, password: '' }));
              }}
              className={`py-2 rounded-lg text-sm font-semibold transition-colors ${
                authMode === 'otp' ? 'bg-white shadow text-purple-600' : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              OTP Login
            </button>
          </div>

          <form onSubmit={authMode === 'password' ? handleSubmit : handleVerifyOtp} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {authMode === 'password' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">One-Time Password</span>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={otpLoading || countdown > 0}
                      className="text-sm font-semibold text-purple-600 hover:text-purple-700 disabled:opacity-60"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent tracking-widest text-center uppercase"
                    placeholder="Enter 6-digit OTP"
                    disabled={!otpSent}
                  />
                  <p className="text-xs text-gray-500">
                    We will send a 6-digit verification code to your registered email. Enter the code within 10 minutes.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading || !otpSent}
                  className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
              </>
            )}
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all"
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Google
              </button>
              <button
                type="button"
                onClick={handleMicrosoftLogin}
                className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-all"
              >
                <SiMicrosoft className="w-5 h-5 mr-2 text-blue-600" />
                Microsoft
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-purple-600 font-semibold hover:text-purple-700">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;


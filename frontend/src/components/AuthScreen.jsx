import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle } from 'lucide-react';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let result;
    if (isLogin) {
      result = await login(username, password);
    } else {
      if (!displayName) {
        setError('Display name is required');
        setLoading(false);
        return;
      }
      result = await register(username, password, displayName);
    }

    setLoading(false);

    if (result.success) {
      navigate('/chats');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-[#111B21] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-[#00A884] w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-white text-3xl font-light">WhatsApp</h1>
        </div>

        {/* Auth Form */}
        <div className="bg-[#202C33] rounded-lg p-8 shadow-xl">
          <h2 className="text-white text-2xl font-light mb-6 text-center">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full bg-[#2A3942] text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#00A884] transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {!isLogin && (
              <div>
                <input
                  type="text"
                  placeholder="Display Name"
                  className="w-full bg-[#2A3942] text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#00A884] transition-all"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full bg-[#2A3942] text-white px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#00A884] transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00A884] text-white py-3 rounded-lg font-medium hover:bg-[#06cf9c] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-[#00A884] hover:underline text-sm"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 bg-[#202C33]/50 rounded-lg p-4 text-center">
          <p className="text-[#8696A0] text-sm">
            Create an account to start chatting with other users
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MoreVertical, Camera, Edit, LogOut, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatList = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('chats');
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API}/conversations`);
      setConversations(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API}/users`);
      setUsers(response.data);
      setShowUsers(true);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const startConversation = async (userId) => {
    try {
      const response = await axios.post(`${API}/conversations/start/${userId}`);
      navigate(`/chat/${response.data.conversationId}`);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-[#111B21]">
      {/* Header */}
      <div className="bg-[#202C33] px-4 py-3 flex items-center justify-between">
        <h1 className="text-white text-xl font-medium">WhatsApp</h1>
        <div className="flex items-center gap-6">
          <Camera className="w-5 h-5 text-[#8696A0] cursor-pointer hover:text-white transition-colors" />
          <Search className="w-5 h-5 text-[#8696A0] cursor-pointer hover:text-white transition-colors" />
          <button
            onClick={logout}
            className="text-[#8696A0] hover:text-red-500 transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#202C33] px-4 pb-2">
        <div className="bg-[#111B21] rounded-lg px-4 py-2 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#8696A0]" />
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent text-white text-sm outline-none flex-1 placeholder-[#8696A0]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-[#202C33] px-4 flex gap-8 border-b border-[#2A3942]">
        <button
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'chats' ? 'text-[#00A884]' : 'text-[#8696A0]'
          }`}
          onClick={() => {
            setActiveTab('chats');
            setShowUsers(false);
          }}
        >
          Chats
          {activeTab === 'chats' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A884]" />
          )}
        </button>
        <button
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'status' ? 'text-[#00A884]' : 'text-[#8696A0]'
          }`}
          onClick={() => setActiveTab('status')}
        >
          Status
          {activeTab === 'status' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A884]" />
          )}
        </button>
        <button
          className={`pb-3 text-sm font-medium transition-colors relative ${
            activeTab === 'calls' ? 'text-[#00A884]' : 'text-[#8696A0]'
          }`}
          onClick={() => setActiveTab('calls')}
        >
          Calls
          {activeTab === 'calls' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#00A884]" />
          )}
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-[#8696A0]">Loading...</div>
          </div>
        ) : showUsers ? (
          // User List for starting new conversations
          filteredUsers.map((u) => (
            <div
              key={u.userId}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#202C33] cursor-pointer transition-colors border-b border-[#2A3942]/30"
              onClick={() => startConversation(u.userId)}
            >
              <div className="relative">
                <img
                  src={u.avatar}
                  alt={u.displayName}
                  className="w-12 h-12 rounded-full bg-[#6B7C85]"
                />
                {u.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00A884] rounded-full border-2 border-[#111B21]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white text-[15px] font-normal truncate">
                  {u.displayName}
                </h3>
                <p className="text-[#8696A0] text-[13px] truncate">
                  {u.online ? 'online' : 'offline'}
                </p>
              </div>
            </div>
          ))
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <MessageCircle className="w-16 h-16 text-[#8696A0] mb-4" />
            <p className="text-[#8696A0] text-lg mb-2">No conversations yet</p>
            <p className="text-[#8696A0] text-sm mb-4">
              Start a new conversation by clicking the button below
            </p>
          </div>
        ) : (
          // Conversation List
          filteredConversations.map((conv) => (
            <div
              key={conv.conversationId}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[#202C33] cursor-pointer transition-colors border-b border-[#2A3942]/30"
              onClick={() => navigate(`/chat/${conv.conversationId}`)}
            >
              <div className="relative">
                <img
                  src={conv.otherUser.avatar}
                  alt={conv.otherUser.displayName}
                  className="w-12 h-12 rounded-full bg-[#6B7C85]"
                />
                {conv.otherUser.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#00A884] rounded-full border-2 border-[#111B21]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-white text-[15px] font-normal truncate">
                    {conv.otherUser.displayName}
                  </h3>
                  <span className="text-[#8696A0] text-xs">{conv.timestamp}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-[#8696A0] text-[13px] truncate">
                    {conv.lastMessage || 'No messages yet'}
                  </p>
                  {conv.unreadCount > 0 && (
                    <div className="bg-[#00A884] rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center ml-2">
                      <span className="text-[#111B21] text-xs font-medium">
                        {conv.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-6 right-6">
        <button
          onClick={fetchUsers}
          className="bg-[#00A884] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-[#06cf9c] transition-all hover:scale-110"
        >
          <Edit className="w-6 h-6 text-[#111B21]" />
        </button>
      </div>
    </div>
  );
};

export default ChatList;
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Search, Phone, Video, Smile, Paperclip, Mic, Send, Check, CheckCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ChatWindow = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    
    // Poll for new messages every 2 seconds
    pollIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 2000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [conversationId]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API}/conversations/${conversationId}/messages`);
      setMessages(response.data);
      
      // Get conversation details to find other user
      const convResponse = await axios.get(`${API}/conversations`);
      const currentConv = convResponse.data.find(c => c.conversationId === conversationId);
      if (currentConv) {
        setOtherUser(currentConv.otherUser);
      }
      
      setLoading(false);
      
      // Mark as read
      await axios.put(`${API}/conversations/${conversationId}/read`);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      try {
        await axios.post(`${API}/conversations/${conversationId}/messages`, {
          text: message
        });
        setMessage('');
        fetchMessages(); // Refresh messages immediately
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111B21] text-white">
        Loading...
      </div>
    );
  }

  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#111B21] text-white">
        Chat not found
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0B141A]">
      {/* Header */}
      <div className="bg-[#202C33] px-4 py-2 flex items-center gap-3">
        <button
          onClick={() => navigate('/chats')}
          className="text-[#8696A0] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <img
          src={otherUser.avatar}
          alt={otherUser.displayName}
          className="w-10 h-10 rounded-full bg-[#6B7C85]"
        />
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-base font-normal">{otherUser.displayName}</h2>
          <p className="text-[#8696A0] text-xs">
            {otherUser.online ? 'online' : 'offline'}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <Video className="w-5 h-5 text-[#8696A0] cursor-pointer hover:text-white transition-colors" />
          <Phone className="w-5 h-5 text-[#8696A0] cursor-pointer hover:text-white transition-colors" />
          <MoreVertical className="w-5 h-5 text-[#8696A0] cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Messages Container */}
      <div
        className="flex-1 overflow-y-auto px-4 py-3"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182229' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[#8696A0]">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.messageId}
              className={`flex mb-2 ${msg.senderId === user.userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 ${
                  msg.senderId === user.userId
                    ? 'bg-[#005C4B] text-white'
                    : 'bg-[#202C33] text-white'
                } shadow-sm`}
              >
                <p className="text-[14.2px] leading-[19px] break-words">{msg.text}</p>
                <div className="flex items-center justify-end gap-1 mt-1">
                  <span className="text-[11px] text-[#8696A0]">{msg.timestamp}</span>
                  {msg.senderId === user.userId && (
                    <span className="text-[#8696A0]">
                      {msg.status === 'read' ? (
                        <CheckCheck className="w-4 h-4 text-[#53BDEB]" />
                      ) : msg.status === 'delivered' ? (
                        <CheckCheck className="w-4 h-4" />
                      ) : (
                        <Check className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-[#202C33] px-3 py-2 flex items-end gap-2">
        <div className="flex-1 bg-[#2A3942] rounded-3xl px-4 py-2 flex items-center gap-2">
          <button className="text-[#8696A0] hover:text-white transition-colors">
            <Smile className="w-6 h-6" />
          </button>
          <input
            type="text"
            placeholder="Message"
            className="flex-1 bg-transparent text-white text-[15px] outline-none placeholder-[#8696A0]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="text-[#8696A0] hover:text-white transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
        </div>
        {message.trim() ? (
          <button
            onClick={handleSendMessage}
            className="bg-[#00A884] w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#06cf9c] transition-all hover:scale-105"
          >
            <Send className="w-5 h-5 text-[#111B21] ml-0.5" />
          </button>
        ) : (
          <button className="bg-[#00A884] w-12 h-12 rounded-full flex items-center justify-center hover:bg-[#06cf9c] transition-all hover:scale-105">
            <Mic className="w-6 h-6 text-[#111B21]" />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
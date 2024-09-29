"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaLinkedin, FaPlus } from 'react-icons/fa';

const socialIcons = {
  Facebook: FaFacebook,
  Instagram: FaInstagram,
  LinkedIn: FaLinkedin,
};

export default function Dashboard() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [showAccountList, setShowAccountList] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [socialData, setSocialData] = useState({});
  const [accessTokens, setAccessTokens] = useState({});
  
  useEffect(() => {
    const loadAccessTokens = () => {
      const savedTokens = JSON.parse(localStorage.getItem('accessTokens') || '{}');
      setAccessTokens(savedTokens);
    };

    const loadConnectedAccounts = () => {
      const savedAccounts = JSON.parse(localStorage.getItem('connectedAccounts') || '[]');
      setConnectedAccounts(savedAccounts);
    };

    loadAccessTokens();
    loadConnectedAccounts();
  }, []);

  useEffect(() => {
    const fetchSocialData = async () => {
      for (const account of connectedAccounts) {
        if (account.name === 'Instagram') {
          const accessToken = accessTokens.Instagram;
          const response = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${accessToken}`);
          const data = await response.json();
          setSocialData(prev => ({ ...prev, Instagram: data.data }));
        }
      }
    };

    if (connectedAccounts.length > 0) {
      fetchSocialData();
    }
  }, [connectedAccounts, accessTokens]);

  const handleAddAccount = async (account) => {
    if (account === 'Instagram' && !connectedAccounts.find(acc => acc.name === 'Instagram')) {
      const redirectUri = 'https://localhost:3000/dashboard';
      const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
      const scope = 'user_profile,user_media';
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
      
      window.location.href = authUrl;
    } else if (!connectedAccounts.find(acc => acc.name === account)) {
      const newConnectedAccounts = [...connectedAccounts, { name: account, username: null }];
      setConnectedAccounts(newConnectedAccounts);
      localStorage.setItem('connectedAccounts', JSON.stringify(newConnectedAccounts));
    }
    setShowAccountList(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code) => {
    try {
      const response = await fetch('/api/instagram-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const accessToken = data.accessToken;

      const mediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${accessToken}`);
      const mediaData = await mediaResponse.json();
      
      setSocialData(prev => ({ ...prev, Instagram: mediaData.data }));
      setAccessTokens(prev => ({ ...prev, Instagram: accessToken }));
      localStorage.setItem('accessTokens', JSON.stringify({ ...accessTokens, Instagram: accessToken }));
      
      const userResponse = await fetch(`https://graph.instagram.com/me?fields=username&access_token=${accessToken}`);
      const userData = await userResponse.json();
      const newConnectedAccounts = connectedAccounts.filter(acc => acc.name !== 'Instagram');
      newConnectedAccounts.push({ name: 'Instagram', username: userData.username });
      setConnectedAccounts(newConnectedAccounts);
      localStorage.setItem('connectedAccounts', JSON.stringify(newConnectedAccounts));
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  const handleAskAboutPost = async (post) => {
    const question = prompt("What do you want to ask about this post?");
    
    if (question) {
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: question,
            socialData: { Instagram: [post] },
          }),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        if (data.response) {
          setChat(prev => [...prev, { text: data.response, sender: 'ai' }]);
        } else {
          console.error("No response from AI.");
        }
      } catch (error) {
        console.error("Error asking about post:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (message.trim()) {
      const requestBody = {
        message,
        socialData,
      };
  
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        console.error("Error in API call:", response.statusText);
        return;
      }
  
      const data = await response.json();
      
      if (data.response) {
        setChat(prev => [...prev, { text: message, sender: 'user' }, { text: data.response, sender: 'ai' }]);
        setMessage('');
      } else {
        console.error("No response from AI.");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-gray-800 p-6 space-y-6 overflow-y-auto h-full shadow-lg"
      >
        <h2 className="text-2xl font-bold text-indigo-400">Digital Assistant</h2>
        <button 
          onClick={() => setShowAccountList(!showAccountList)}
          className="flex items-center space-x-2 w-full p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
        >
          <FaPlus className="text-xl" />
          <span>Add Account</span>
        </button>
        
        {showAccountList && (
          <div className="mt-4 max-h-40 overflow-y-auto">
            {Object.entries(socialIcons).map(([name, Icon]) => (
              <button 
                key={name} 
                className="flex items-center space-x-2 w-full p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors mb-2"
                onClick={() => handleAddAccount(name)}
              >
                <Icon className="text-xl text-indigo-400" />
                <span>{name}</span>
              </button>
            ))}
          </div>
        )}

        {connectedAccounts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Connected:</h3>
            {connectedAccounts.map((account) => {
              const Icon = socialIcons[account.name];
              return (
                <div key={account.name} className="flex items-center space-x-2 w-full p-2 rounded-lg bg-gray-700 mb-2">
                  <Icon className="text-xl text-indigo-400" />
                  <span className="font-medium">{account.name}</span>
                  {account.username && <span className="text-sm text-gray-400 font-mono">@{account.username}</span>}
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {socialData.Instagram && socialData.Instagram.map(post => (
            <div key={post.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
              <img src={post.media_url} alt={post.caption} className="w-full h-auto rounded-lg" />
              <p className="mt-2 text-gray-300">{post.caption}</p>
              <button 
                onClick={() => handleAskAboutPost(post)} 
                className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Ask AI about this post
              </button>
            </div>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-800">
          {chat.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-gray-800 shadow-lg">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your digital footprint..."
              className="flex-1 p-2 rounded-lg border border-gray-600 bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
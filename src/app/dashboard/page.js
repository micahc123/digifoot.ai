'use client';

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

    const handleKeyPress = (event) => {
      if (event.shiftKey && event.ctrlKey && event.key.toLowerCase() === 'u') {
        localStorage.removeItem('accessTokens');
        localStorage.removeItem('connectedAccounts');
        setAccessTokens({});
        setConnectedAccounts([]);
        setSocialData({});
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    const fetchSocialData = async () => {
      for (const account of connectedAccounts) {
        if (account.name === 'Instagram') {
          await fetchInstagramData(accessTokens.Instagram);
        } else if (account.name === 'Facebook') {
          await fetchFacebookData(accessTokens.Facebook);
        }
      }
    };

    if (connectedAccounts.length > 0 && Object.keys(accessTokens).length > 0) {
      fetchSocialData();
    }
  }, [connectedAccounts, accessTokens]);

  const fetchInstagramData = async (accessToken) => {
    try {
      const response = await fetch(`https://graph.instagram.com/me?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${accessToken}`);
      const data = await response.json();
      if (data && data.username) {
        const newSocialData = {
          ...socialData,
          Instagram: {
            username: data.username,
            posts: data.media?.data || [],
            bio: data.biography || ''
          }
        };
        setSocialData(newSocialData);
        
        await sendDataToServer(newSocialData);
      } else {
        console.error("Invalid data structure received from Instagram API", data);
      }
    } catch (error) {
      console.error("Error fetching Instagram data:", error);
    }
  };

  const fetchFacebookData = async (accessToken) => {
    try {
      const response = await fetch(`https://graph.facebook.com/me?fields=id,name,posts{message,created_time,full_picture}&access_token=${accessToken}`);
      const data = await response.json();
      if (data && data.name) {
        const newSocialData = {
          ...socialData,
          Facebook: {
            name: data.name,
            posts: data.posts?.data || [],
          }
        };
        setSocialData(newSocialData);
        
        await sendDataToServer(newSocialData);
      } else {
        console.error("Invalid data structure received from Facebook API", data);
      }
    } catch (error) {
      console.error("Error fetching Facebook data:", error);
    }
  };

  const sendDataToServer = async (data) => {
    try {
      const response = await fetch('/api/save-social-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('Data sent to server successfully');
    } catch (error) {
      console.error("Error sending data to server:", error);
    }
  };

  const handleAddAccount = async (account) => {
    if (account === 'Instagram' && !connectedAccounts.find(acc => acc.name === 'Instagram')) {
      const redirectUri = 'https://localhost:3000/dashboard';
      const clientId = process.env.NEXT_PUBLIC_INSTAGRAM_APP_ID;
      const scope = 'user_profile,user_media';
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
      
      window.location.href = authUrl;
    } else if (account === 'Facebook' && !connectedAccounts.find(acc => acc.name === 'Facebook')) {
      const redirectUri = 'https://localhost:3000/dashboard';
      const clientId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
      const scope = 'public_profile,user_posts';
      const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=facebook`;
      
      window.location.href = authUrl;
    } else if (!connectedAccounts.find(acc => acc.name === account)) {
      setConnectedAccounts(prevAccounts => [...prevAccounts, { name: account, username: null }]);
      localStorage.setItem('connectedAccounts', JSON.stringify([...connectedAccounts, { name: account, username: null }]));
    }
    setShowAccountList(false);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    if (code) {
      exchangeCodeForToken(code, state);
    }
  }, []);

  const exchangeCodeForToken = async (code, state) => {
    try {
      const platform = state === 'facebook' ? 'facebook' : 'instagram';
      
      const response = await fetch(`/api/${platform}-auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const accessToken = data.accessToken;

      if (platform === 'instagram') {
        await handleInstagramAuth(accessToken);
      } else if (platform === 'facebook') {
        await handleFacebookAuth(accessToken);
      }

      window.history.replaceState({}, document.title, "/dashboard");
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  const handleInstagramAuth = async (accessToken) => {
    const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,media{id,caption,media_type,media_url,timestamp}&access_token=${accessToken}`);
    const userData = await userResponse.json();
    
    if (userData && userData.username) {
      const newSocialData = {
        ...socialData,
        Instagram: {
          username: userData.username,
          posts: userData.media?.data || [],
          bio: userData.biography || ''
        }
      };
      setSocialData(newSocialData);
      setAccessTokens(prev => ({ ...prev, Instagram: accessToken }));
      localStorage.setItem('accessTokens', JSON.stringify({ ...accessTokens, Instagram: accessToken }));
      
      setConnectedAccounts(prevAccounts => {
        const newAccounts = prevAccounts.filter(acc => acc.name !== 'Instagram');
        newAccounts.push({ name: 'Instagram', username: userData.username });
        localStorage.setItem('connectedAccounts', JSON.stringify(newAccounts));
        return newAccounts;
      });

      await sendDataToServer(newSocialData);
    } else {
      console.error("Invalid user data received from Instagram API", userData);
    }
  };

  const handleFacebookAuth = async (accessToken) => {
    const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,posts{message,created_time,full_picture}&access_token=${accessToken}`);
    const userData = await userResponse.json();
    
    if (userData && userData.name) {
      const newSocialData = {
        ...socialData,
        Facebook: {
          name: userData.name,
          posts: userData.posts?.data || [],
        }
      };
      setSocialData(newSocialData);
      setAccessTokens(prev => ({ ...prev, Facebook: accessToken }));
      localStorage.setItem('accessTokens', JSON.stringify({ ...accessTokens, Facebook: accessToken }));
      
      setConnectedAccounts(prevAccounts => {
        const newAccounts = prevAccounts.filter(acc => acc.name !== 'Facebook');
        newAccounts.push({ name: 'Facebook', username: userData.name });
        localStorage.setItem('connectedAccounts', JSON.stringify(newAccounts));
        return newAccounts;
      });

      await sendDataToServer(newSocialData);
    } else {
      console.error("Invalid user data received from Facebook API", userData);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (message.trim()) {
      const requestBody = {
        message,
        socialData,
      };
  
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        
        if (data.response) {
          setChat(prev => [...prev, { text: message, sender: 'user' }, { text: data.response, sender: 'ai' }]);
          setMessage('');
        } else {
          console.error("No response from AI.");
        }
      } catch (error) {
        console.error("Error in API call:", error);
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
// src/app/dashboard/page.js
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

    loadAccessTokens();
  }, []);

  useEffect(() => {
    const fetchSocialData = async () => {
      for (const account of connectedAccounts) {
        if (account === 'Instagram') {
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
    if (account === 'Instagram') {
      const redirectUri = 'https://localhost:3000/dashboard';
      const clientId = '1211078713493610';
      const scope = 'user_profile,user_media';
      const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
      
      window.location.href = authUrl;
    } else {
      setConnectedAccounts([...connectedAccounts, account]);
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
    const response = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: '1211078713493610',
        client_secret: '33a02c6cefc7a1fd6ab8fce7dfd799b3',
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: code,
      }),
    });
    
    const data = await response.json();
    const accessToken = data.access_token;

    const mediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,timestamp&access_token=${accessToken}`);
    const mediaData = await mediaResponse.json();
    
    setSocialData(prev => ({ ...prev, Instagram: mediaData.data }));
    setAccessTokens(prev => ({ ...prev, Instagram: accessToken }));
    localStorage.setItem('accessTokens', JSON.stringify({ ...accessTokens, Instagram: accessToken }));
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
    <div className="flex h-screen bg-background text-text">
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-surface p-6 space-y-6 overflow-y-auto h-full"
      >
        <h2 className="text-2xl font-bold text-gradient">Digital Assistant</h2>
        <button 
          onClick={() => setShowAccountList(!showAccountList)}
          className="flex items-center space-x-2 w-full p-2 rounded-lg bg-primary hover:bg-secondary transition-colors"
        >
          <FaPlus className="text-xl" />
          <span>Add Account</span>
        </button>
        
        {showAccountList && (
          <div className="mt-4 max-h-40 overflow-y-auto">
            {Object.entries(socialIcons).map(([name, Icon]) => (
              <button 
                key={name} 
                className="flex items-center space-x-2 w-full p-2 rounded-lg bg-background hover:bg-primary transition-colors mb-2"
                onClick={() => handleAddAccount(name)}
              >
                <Icon className="text-xl" />
                <span>{name}</span>
              </button>
            ))}
          </div>
        )}

        {connectedAccounts.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Connected:</h3>
            {connectedAccounts.map((account) => {
              const Icon = socialIcons[account];
              return (
                <div key={account} className="flex items-center space-x-2 w-full p-2 rounded-lg bg-secondary mb-2">
                  <Icon className="text-xl" />
                  <span>{account}</span>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {socialData.Instagram && socialData.Instagram.map(post => (
            <div key={post.id} className="bg-surface p-4 rounded-lg shadow">
              <img src={post.media_url} alt={post.caption} className="w-full h-auto rounded" />
              <p className="mt-2">{post.caption}</p>
              <button 
                onClick={() => handleAskAboutPost(post)} 
                className="mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
              >
                Ask AI about this post
              </button>
            </div>
          ))}
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {chat.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-4 bg-surface">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your digital footprint..."
              className="flex-1 p-2 rounded-lg bg-background text-text"
            />
            <button type="submit" className="px-4 py-2 bg-primary text-text rounded-lg hover:bg-secondary transition-colors">
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
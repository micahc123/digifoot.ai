'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFacebook, FaInstagram, FaLinkedin, FaPlus, FaPaperPlane, FaTimes, FaEye } from 'react-icons/fa';

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
  const [hoveredAccount, setHoveredAccount] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showPosts, setShowPosts] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    const loadAccessTokens = () => {
      const savedTokens = JSON.parse(localStorage.getItem('accessTokens') || '{}');
      setAccessTokens(savedTokens);
    };

    const loadConnectedAccounts = () => {
      const savedAccounts = JSON.parse(localStorage.getItem('connectedAccounts') || '[]');
      setConnectedAccounts(savedAccounts);
    };

    const loadSocialData = () => {
      const savedSocialData = JSON.parse(localStorage.getItem('socialData') || '{}');
      setSocialData(savedSocialData);
    };

    loadAccessTokens();
    loadConnectedAccounts();
    loadSocialData();

    const handleKeyPress = (event) => {
      if (event.shiftKey && event.ctrlKey && event.key.toLowerCase() === 'u') {
        localStorage.removeItem('accessTokens');
        localStorage.removeItem('connectedAccounts');
        localStorage.removeItem('socialData');
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
        if (account.name === 'Instagram' && !socialData.Instagram) {
          await fetchInstagramData(accessTokens.Instagram);
        } else if (account.name === 'Facebook' && !socialData.Facebook) {
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
      const response = await fetch(`https://graph.instagram.com/me?fields=id,username,media{id,caption,media_type,media_url,timestamp},followers_count,follows_count&access_token=${accessToken}`);
      const data = await response.json();
      if (data && data.username) {
        const newSocialData = {
          ...socialData,
          Instagram: {
            username: data.username,
            posts: data.media?.data || [],
            bio: data.biography || '',
            followers: data.followers_count,
            following: data.follows_count,
            profileImage: data.profile_picture_url || '',
          }
        };
        setSocialData(newSocialData);
        localStorage.setItem('socialData', JSON.stringify(newSocialData));
        
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
      const response = await fetch(`https://graph.facebook.com/me?fields=id,name,posts{message,created_time,full_picture},friends,picture&access_token=${accessToken}`);
      const data = await response.json();
      if (data && data.name) {
        const newSocialData = {
          ...socialData,
          Facebook: {
            name: data.name,
            posts: data.posts?.data || [],
            friends: data.friends?.summary?.total_count || 0,
            profileImage: data.picture?.data?.url || '',
          }
        };
        setSocialData(newSocialData);
        localStorage.setItem('socialData', JSON.stringify(newSocialData));
        
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
      const scope = 'public_profile,user_posts,user_friends';
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
    const userResponse = await fetch(`https://graph.instagram.com/me?fields=id,username,media{id,caption,media_type,media_url,timestamp},followers_count,follows_count&access_token=${accessToken}`);
    const userData = await userResponse.json();
    
    if (userData && userData.username) {
      const newSocialData = {
        ...socialData,
        Instagram: {
          username: userData.username,
          posts: userData.media?.data || [],
          bio: userData.biography || '',
          followers: userData.followers_count,
          following: userData.follows_count,
          profileImage: userData.profile_picture_url || '',
        }
      };
      setSocialData(newSocialData);
      localStorage.setItem('socialData', JSON.stringify(newSocialData));
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
    const userResponse = await fetch(`https://graph.facebook.com/me?fields=id,name,posts{message,created_time,full_picture},friends,picture&access_token=${accessToken}`);
    const userData = await userResponse.json();
    
    if (userData && userData.name) {
      const newSocialData = {
        ...socialData,
        Facebook: {
          name: userData.name,
          posts: userData.posts?.data || [],
          friends: userData.friends?.summary?.total_count || 0,
          profileImage: userData.picture?.data?.url || '',
        }
      };
      setSocialData(newSocialData);
      localStorage.setItem('socialData', JSON.stringify(newSocialData));
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
      setChat(prev => [...prev, { text: message, sender: 'user' }]);
      setMessage('');
      setIsTyping(true);
      
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
          setTimeout(() => {
            setChat(prev => [...prev, { text: data.response, sender: 'ai' }]);
            setIsTyping(false);
          }, 1000);
        } else {
          console.error("No response from AI.");
          setChat(prev => [...prev, { text: "I'm sorry, I couldn't process that request.", sender: 'ai' }]);
          setIsTyping(false);
        }
      } catch (error) {
        console.error("Error in API call:", error);
        setChat(prev => [...prev, { text: "Sorry, there was an error processing your request.", sender: 'ai' }]);
        setIsTyping(false);
      }
    }
  };

  const getAccountStats = (account) => {
    if (account.name === 'Instagram' && socialData.Instagram) {
      return socialData.Instagram;
    } else if (account.name === 'Facebook' && socialData.Facebook) {
      return socialData.Facebook;
    }
    return null;
  };

  const getAllPosts = () => {
    let allPosts = [];
    if (socialData.Instagram) {
      allPosts = [...allPosts, ...socialData.Instagram.posts];
    }
    if (socialData.Facebook) {
      allPosts = [...allPosts, ...socialData.Facebook.posts];
    }
    return allPosts.sort((a, b) => new Date(b.created_time || b.timestamp) - new Date(a.created_time || a.timestamp));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 shadow-md">
        <h1 className="text-2xl font-bold text-indigo-400">digifoot.ai</h1>
      </header>
      
      <div className="flex-1 flex overflow-hidden">
        <motion.aside 
          initial={{ x: -300 }}
          animate={{ x: 0 }}
          className="w-64 bg-gray-800 p-4 overflow-y-auto shadow-lg"
        >
          <button 
            onClick={() => setShowAccountList(!showAccountList)}
            className="flex items-center justify-center space-x-2 w-full p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors mb-4"
          >
            <FaPlus className="text-xl" />
            <span>Add Account</span>
          </button>
          
          {showAccountList && (
            <div className="mb-4 space-y-2">
              {Object.entries(socialIcons).map(([name, Icon]) => (
                <button 
                  key={name} 
                  className="flex items-center space-x-2 w-full p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  onClick={() => handleAddAccount(name)}
                >
                  <Icon className="text-xl text-indigo-400" />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          )}

          {connectedAccounts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Connected Accounts:</h3>
              {connectedAccounts.map((account) => {
                const Icon = socialIcons[account.name];
                return (
                  <div 
                    key={account.name} 
                    className="relative flex items-center space-x-2 w-full p-2 rounded-lg bg-gray-700 mb-2 hover:bg-gray-600 transition-colors cursor-pointer"
                    onMouseEnter={() => setHoveredAccount(account.name)}
                    onMouseLeave={() => setHoveredAccount(null)}
                    onClick={() => setSelectedAccount(account)}
                  >
                    <Icon className="text-xl text-indigo-400" />
                    <div className="flex-1">
                      <span className="font-medium">{account.name}</span>
                      {account.username && <span className="text-sm text-gray-400 block">@{account.username}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 p-4 overflow-y-auto bg-gray-800">
            {chat.map((msg, index) => (
              <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                  {msg.text}
                </span>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            )}
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
              <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center">
                <FaPaperPlane className="mr-2" />
                Send
              </button>
            </div>
          </form>
        </main>
      </div>

      <button
        onClick={() => setShowPosts(true)}
        className="fixed bottom-4 left-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
      >
        <FaEye className="text-xl" />
      </button>

      <AnimatePresence>
        {selectedAccount && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedAccount(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-indigo-400">{selectedAccount.name} Stats</h2>
                <button onClick={() => setSelectedAccount(null)} className="text-gray-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>
              
              {getAccountStats(selectedAccount) ? (
                <div className="space-y-4">
                  {selectedAccount.name === 'Instagram' && (
                    <>
                      <div className="flex items-center space-x-4">
                        <img src={socialData.Instagram.profileImage} alt={socialData.Instagram.username} className="w-16 h-16 rounded-full" />
                        <div>
                          <p className="font-semibold text-lg">@{socialData.Instagram.username}</p>
                          <p className="text-gray-400">{socialData.Instagram.bio}</p>
                        </div>
                      </div>
                      <div className="flex justify-around text-center">
                        <div>
                          <p className="font-bold text-xl">{socialData.Instagram.posts.length}</p>
                          <p className="text-gray-400">Posts</p>
                        </div>
                        <div>
                          <p className="font-bold text-xl">{socialData.Instagram.followers}</p>
                          <p className="text-gray-400">Followers</p>
                        </div>
                        <div>
                          <p className="font-bold text-xl">{socialData.Instagram.following}</p>
                          <p className="text-gray-400">Following</p>
                        </div>
                      </div>
                    </>
                  )}
                  {selectedAccount.name === 'Facebook' && (
                    <>
                      <div className="flex items-center space-x-4">
                        <img src={socialData.Facebook.profileImage} alt={socialData.Facebook.name} className="w-16 h-16 rounded-full" />
                        <div>
                          <p className="font-semibold text-lg">{socialData.Facebook.name}</p>
                        </div>
                      </div>
                      <div className="flex justify-around text-center">
                        <div>
                          <p className="font-bold text-xl">{socialData.Facebook.posts.length}</p>
                          <p className="text-gray-400">Posts</p>
                        </div>
                        <div>
                          <p className="font-bold text-xl">{socialData.Facebook.friends}</p>
                          <p className="text-gray-400">Friends</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-gray-400">No data available for this account.</p>
              )}
            </motion.div>
          </motion.div>
        )}

        {showPosts && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowPosts(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-3xl w-full m-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-indigo-400">All Posts</h2>
                <button onClick={() => setShowPosts(false)} className="text-gray-400 hover:text-white">
                  <FaTimes />
                </button>
              </div>
              <div className="space-y-4">
                {getAllPosts().map((post, index) => (
                  <div key={index} className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-sm text-gray-400 mb-2">{new Date(post.created_time || post.timestamp).toLocaleString()}</p>
                    <p>{post.message || post.caption}</p>
                    {post.full_picture && <img src={post.full_picture} alt="Post" className="mt-2 rounded-lg" />}
                    {post.media_url && <img src={post.media_url} alt="Post" className="mt-2 rounded-lg" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
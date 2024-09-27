// src/app/dashboard/page.js
"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaLinkedin, FaPlus } from 'react-icons/fa';
import dynamic from 'next/dynamic';

const ClientMetrics = dynamic(() => import('../../components/ClientMetrics'), { ssr: false });

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

  useEffect(() => {
    const fetchSocialData = async () => {
      for (const account of connectedAccounts) {
        const response = await fetch(`/api/${account.toLowerCase()}`);
        const data = await response.json();
        setSocialData(prev => ({ ...prev, [account]: data }));
      }
    };

    if (connectedAccounts.length > 0) {
      fetchSocialData();
    }
  }, [connectedAccounts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChat([...chat, { text: message, sender: 'user' }]);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, socialData }),
      });
      
      const data = await response.json();
      setChat(prev => [...prev, { text: data.response, sender: 'ai' }]);
      setMessage('');
    }
  };

  const handleAddAccount = async (account) => {
    if (!connectedAccounts.includes(account)) {
      // Here you would typically initiate the OAuth flow
      // For this example, we'll just add the account
      setConnectedAccounts([...connectedAccounts, account]);
    }
    setShowAccountList(false);
  };

  return (
    <div className="flex h-screen pt-16 bg-background text-text">
      {/* Sidebar */}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-surface p-6 space-y-6 overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-gradient">Connected Accounts</h2>
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto">
          {chat.map((msg, index) => (
            <div key={index} className={`mb-4 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>

        {/* Input Area */}
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

      {/* Metrics Sidebar */}
      <motion.div 
        initial={{ x: 300 }}
        animate={{ x: 0 }}
        className="w-64 bg-surface p-6 space-y-6 overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-gradient">Digital Footprint</h2>
        <ClientMetrics socialData={socialData} />
      </motion.div>
    </div>
  );
}
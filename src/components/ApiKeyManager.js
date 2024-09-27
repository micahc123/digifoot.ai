
// components/ApiKeyManager.js
import React, { useState, useEffect } from 'react';

const ApiKeyManager = ({ onSave }) => {
  const [keys, setKeys] = useState({
    FACEBOOK_ACCESS_TOKEN: '',
    INSTAGRAM_ACCESS_TOKEN: '',
    INSTAGRAM_USER_ID: '',
    LINKEDIN_ACCESS_TOKEN: '',
    OPENAI_API_KEY: '',
  });

  useEffect(() => {
    // Load saved keys from localStorage
    const savedKeys = JSON.parse(localStorage.getItem('apiKeys') || '{}');
    setKeys(prevKeys => ({ ...prevKeys, ...savedKeys }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setKeys(prevKeys => ({ ...prevKeys, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('apiKeys', JSON.stringify(keys));
    onSave(keys);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Existing input fields... */}
      <div>
        <label htmlFor="OPENAI_API_KEY" className="block text-sm font-medium">
          OpenAI API Key
        </label>
        <input
          type="text"
          id="OPENAI_API_KEY"
          name="OPENAI_API_KEY"
          value={keys.OPENAI_API_KEY}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        Save API Keys
      </button>
    </form>
  );
};

export default ApiKeyManager;
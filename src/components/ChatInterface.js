import { useState } from 'react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Add AI response logic here
    }
  };

  return (
    <div className="glass-effect rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4 text-gradient">AI Chat</h3>
      <div className="h-96 overflow-y-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${
              message.sender === 'user' 
                ? 'bg-primary ml-auto animate-fade-in' 
                : 'bg-secondary animate-float'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow bg-surface rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="Ask about your digital footprint..."
        />
        <button
          type="submit"
          className="bg-accent hover:bg-accent-dark px-6 py-2 rounded-r-lg transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
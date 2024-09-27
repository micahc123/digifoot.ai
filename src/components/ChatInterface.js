"use client";
import { useState } from 'react';
import { Input } from "./ui/input";
import { Button } from "./ui/moving-border";

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
    <div className="w-full max-w-md mx-auto">
      <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 rounded-lg bg-gray-800">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${
              message.sender === 'user' 
                ? 'bg-blue-500 ml-auto' 
                : 'bg-gray-700'
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your digital footprint..."
          className="flex-grow mr-2"
        />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
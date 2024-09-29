// src/components/Chatbot.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChatMessage, ChatResponse } from '../types';

interface ChatbotProps {
  diagnosis: string;
}

const Chatbot: React.FC<ChatbotProps> = ({ diagnosis }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: ChatMessage = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const response = await axios.post<ChatResponse>('/api/chatbot', {
        messages: [...messages, newMessage],
        diagnosis,
      });

      if (response.data.error) {
        setError(response.data.error);
      } else if (response.data.message) {
        const botMessage: ChatMessage = { role: 'assistant', content: response.data.message };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch (err) {
      console.error('Error communicating with chatbot:', err);
      setError('An error occurred while communicating with the chatbot.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mt-8">
      <h2 className="text-xl font-semibold mb-4">Chatbot Support</h2>
      <div className="flex flex-col h-64 overflow-y-auto border p-2 rounded mb-4 bg-gray-50 dark:bg-gray-700">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded ${
              msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900 self-end' : 'bg-green-100 dark:bg-green-900 self-start'
            }`}
          >
            <p className="text-sm">{msg.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 border rounded-l px-4 py-2 focus:outline-none dark:bg-gray-600 dark:text-white"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
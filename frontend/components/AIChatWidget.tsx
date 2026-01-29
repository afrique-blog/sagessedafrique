'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

interface AIChatWidgetProps {
  articleId: number;
  countryName: string;
}

export default function AIChatWidget({ articleId, countryName }: AIChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: `Bonjour ! Je suis votre guide virtuel pour ${countryName}. Une question sur la culture, la cuisine ou des conseils pratiques ? Je suis là pour vous aider ! 🌍`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const message = inputValue.trim();
    if (!message || isLoading) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', text: message }]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await api.sendAIMessage(articleId, message, conversationHistory);
      
      // Add AI response
      setMessages(prev => [...prev, { role: 'ai', text: response.reply }]);
      setConversationHistory(response.conversationHistory || []);
    } catch (error) {
      console.error('AI Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Désolé, je rencontre des difficultés de connexion. Réessayez plus tard." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Interface */}
      <div 
        className={`w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-90 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <h3 className="text-sm font-semibold">Guide IA {countryName} ✨</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 text-sm space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-gray-200' : 'bg-yellow-100 border border-yellow-200'
              }`}>
                {msg.role === 'user' ? '👤' : '🤖'}
              </div>
              <div className={`p-3 rounded-xl max-w-[85%] ${
                msg.role === 'user' 
                  ? 'bg-gray-900 text-white rounded-tl-xl rounded-br-xl rounded-bl-xl' 
                  : 'bg-white text-gray-800 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-gray-100'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 border border-yellow-200">
                🤖
              </div>
              <div className="bg-white p-4 rounded-tr-xl rounded-br-xl rounded-bl-xl shadow-sm border border-gray-100 flex gap-2 items-center">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question..."
              disabled={isLoading}
              className="w-full pl-4 pr-12 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-gray-900 text-white rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <div className="text-[10px] text-gray-400 text-center mt-2">Propulsé par Gemini 2.0 Flash</div>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gray-900 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2 font-medium group"
        style={{
          animation: isOpen ? 'none' : 'pulse-glow 2s infinite',
        }}
      >
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap pl-0 group-hover:pl-2">
          Discuter avec le Guide
        </span>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      <style jsx>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(234, 179, 8, 0); }
          100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
        }
      `}</style>
    </div>
  );
}

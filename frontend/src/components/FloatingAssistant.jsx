import React, { useState, useEffect, useRef } from 'react';
import { Bot, Mic, MicOff, Volume2, Send, X, MessageSquare, Sparkles } from 'lucide-react';
import { sendAssistantMessage } from '../services/api';

const FloatingAssistant = ({ currentAppId, onOpenSimplifier }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'assistant', text: 'Hello Officer! I am your LandGuard AI Assistant. Ask me anything about document mismatches, survey numbers, risk factors, or Tamil land terminology.' }
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle Speech Recognition (Microphone)
  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser speech recognition is not supported in this browser.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  // Handle Speech Synthesis (Text to Speech)
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSend = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputMessage('');

    try {
      const res = await sendAssistantMessage(textToSend, currentAppId);
      if (res.success && res.response) {
        const botMsg = { sender: 'assistant', text: res.response.answer };
        setMessages(prev => [...prev, botMsg]);
        speakText(res.response.answer);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'assistant', text: 'Sorry, I am having trouble connecting to the backend assistant server.' }]);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0B3D91',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '30px',
            padding: '0.85rem 1.4rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 8px 20px rgba(11, 61, 145, 0.3)',
            cursor: 'pointer',
            zIndex: 999
          }}
        >
          <Bot size={22} color="#FFFFFF" />
          <span>AI Officer Assistant</span>
          <Sparkles size={16} color="#60A5FA" />
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '380px',
          height: '520px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.2)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            backgroundColor: '#0B3D91',
            color: '#FFFFFF',
            padding: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ backgroundColor: '#2563EB', padding: '0.4rem', borderRadius: '8px' }}>
                <Bot size={20} color="#FFFFFF" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#FFFFFF' }}>LandGuard Voice Assistant</h4>
                <span style={{ fontSize: '0.72rem', color: '#93C5FD', fontWeight: 500 }}>● Officer Support (Tamil / Eng)</span>
              </div>
            </div>

            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div style={{ flex: 1, padding: '1rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.85rem', backgroundColor: '#F8FAFC' }}>
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  backgroundColor: msg.sender === 'user' ? '#2563EB' : '#FFFFFF',
                  color: msg.sender === 'user' ? '#FFFFFF' : '#0F172A',
                  padding: '0.75rem 1rem',
                  borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  fontSize: '0.88rem',
                  border: msg.sender === 'assistant' ? '1px solid #E2E8F0' : 'none',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions & Input */}
          <div style={{ padding: '0.75rem', borderTop: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.6rem', overflowX: 'auto' }}>
              <button 
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', borderRadius: '12px', whiteSpace: 'nowrap' }}
                onClick={() => handleSend("Why is my application under review?")}
              >
                Why under review?
              </button>

              <button 
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.72rem', padding: '0.25rem 0.5rem', borderRadius: '12px', whiteSpace: 'nowrap' }}
                onClick={onOpenSimplifier}
              >
                Simplify Legalese 📜
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={toggleListening}
                style={{
                  backgroundColor: isListening ? '#DC2626' : '#F1F5F9',
                  border: '1px solid #CBD5E1',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isListening ? '#FFFFFF' : '#334155',
                  cursor: 'pointer'
                }}
                title="Voice Query"
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>

              <input
                type="text"
                className="form-input"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask query in English or Tamil..."
                style={{ flex: 1, padding: '0.5rem 0.75rem' }}
              />

              <button
                type="button"
                onClick={() => handleSend()}
                className="btn btn-primary"
                style={{ width: '38px', height: '38px', padding: 0 }}
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingAssistant;

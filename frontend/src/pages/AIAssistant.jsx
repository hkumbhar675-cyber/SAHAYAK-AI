import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useUser } from '../context/UserContext';
import { queryAssistant } from '../services/api';
import {
  Bot,
  Sparkles,
  FileText,
  Globe,
  Mic,
  MicOff,
  Send,
  ArrowRight,
  User,
  Volume2
} from 'lucide-react';
import { CircularProgress } from '@mui/material';

export default function AIAssistant() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const { currentUser } = useUser();

  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: t('chat_welcome')
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Update initial message when language changes
  useEffect(() => {
    setMessages(prev => [
      {
        ...prev[0],
        content: t('chat_welcome')
      },
      ...prev.slice(1)
    ]);
  }, [lang]);

  // Browser Speech Recognition (Web Speech API)
  const handleVoiceToggle = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Speech Recognition is not supported on this browser. Please use Chrome/Edge or type your query.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      
      // Match speech recognition to active platform language
      if (lang === 'mr') {
        recognition.lang = 'mr-IN';
      } else if (lang === 'hi') {
        recognition.lang = 'hi-IN';
      } else {
        recognition.lang = 'en-IN';
      }

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        // Automatically send voice query
        handleSendMessage(transcript);
      };

      recognition.onerror = (event) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleSendMessage = async (customText = null) => {
    const text = (customText !== null ? customText : inputText).trim();
    if (!text || loading) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: text
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const historyPayload = messages.map(m => ({ role: m.role, content: m.content }));
      const res = await queryAssistant(text, lang, historyPayload);

      const assistantMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.response || "I have analyzed your query according to government eligibility guidelines.",
        quick_actions: res.quick_actions || []
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Assistant error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: "I'm currently unable to connect to the remote AI engine. For your profile in Maharashtra, schemes like PM-KISAN, PMEGP, and Mudra loans are available. You can use the Scheme Finder or Partner Locator directly."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    if (action.includes('Find') || action.includes('Schemes') || action.includes('योजना')) {
      navigate('/schemes');
    } else if (action.includes('Eligibility') || action.includes('पात्रता')) {
      navigate('/schemes');
    } else if (action.includes('Partner') || action.includes('भागीदार') || action.includes('Bank')) {
      navigate('/partners');
    } else if (action.includes('Calculate') || action.includes('EMI') || action.includes('गणना')) {
      navigate('/calculator');
    } else {
      handleSendMessage(action);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: 'calc(100vh - 70px)', padding: '2.5rem 1.5rem 4rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Top Header Label & Title Matching Screenshot 3 */}
        <div style={{ marginBottom: '3rem' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#0f5132',
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            marginBottom: '0.75rem',
            textTransform: 'uppercase'
          }}>
            <Bot size={18} color="#0f5132" />
            <span>{t('assistant_badge')}</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 4.5vw, 3.25rem)',
            fontWeight: 800,
            color: '#0f3d24',
            letterSpacing: '-0.035em',
            lineHeight: 1.15,
            marginBottom: '1rem'
          }}>
            {t('assistant_title')}
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: '#4b5563',
            maxWidth: '640px',
            lineHeight: 1.5
          }}>
            {t('assistant_desc')}
          </p>

        </div>

        {/* 2-Column Layout: Left 3 Info Cards + Right Chat Widget (EXACT MATCH TO SCREENSHOT 3) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) minmax(340px, 1.25fr)',
          gap: '2.5rem',
          alignItems: 'start'
        }}>
          
          {/* Left Column: 3 Informative Cards (EXACT REPLICA OF SCREENSHOT 3) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Card 1: AI + Rules */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '1.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={22} color="#0f5132" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '0.35rem' }}>
                  {t('card_ai_rules_title')}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.5 }}>
                  {t('card_ai_rules_desc')}
                </p>
              </div>
            </div>

            {/* Card 2: Explainable Answers */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '1.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileText size={22} color="#0f5132" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '0.35rem' }}>
                  {t('card_explain_title')}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.5 }}>
                  {t('card_explain_desc')}
                </p>
              </div>
            </div>

            {/* Card 3: Multilingual & Voice */}
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              padding: '1.75rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1.25rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                backgroundColor: '#f0fdf4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Globe size={22} color="#0f5132" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111827', marginBottom: '0.35rem' }}>
                  {t('card_multi_title')}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', lineHeight: 1.5 }}>
                  {t('card_multi_desc')}
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Chatbot Widget (EXACT REPLICA OF SCREENSHOT 3) */}
          <div style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '24px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            height: '560px',
            overflow: 'hidden'
          }}>
            
            {/* Chat Header matching Screenshot 3 */}
            <div style={{
              padding: '1.15rem 1.5rem',
              borderBottom: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#ffffff'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#0f5132',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff'
                }}>
                  <Bot size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.98rem', color: '#111827', lineHeight: 1.2 }}>
                    {t('chat_header_title')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#10b981' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                    <span>{t('chat_online')}</span>
                  </div>
                </div>
              </div>

              <Globe size={18} color="#94a3b8" />
            </div>

            {/* Messages Scroll Area */}
            <div style={{
              flex: 1,
              padding: '1.5rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isAssistant ? 'flex-start' : 'flex-end',
                      width: '100%'
                    }}
                  >
                    <div style={{
                      maxWidth: '85%',
                      backgroundColor: isAssistant ? '#ffffff' : '#0f5132',
                      color: isAssistant ? '#374151' : '#ffffff',
                      border: isAssistant ? '1px solid #e5e7eb' : 'none',
                      borderRadius: isAssistant ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                      padding: '1rem 1.25rem',
                      fontSize: '0.92rem',
                      lineHeight: 1.55,
                      boxShadow: isAssistant ? '0 1px 3px rgba(0,0,0,0.03)' : '0 2px 8px rgba(15, 81, 50, 0.2)'
                    }}>
                      {msg.content}
                    </div>

                    {/* Quick action buttons on latest assistant message */}
                    {isAssistant && msg.quick_actions && msg.quick_actions.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                        {msg.quick_actions.map((qa, i) => (
                          <button
                            key={i}
                            onClick={() => handleQuickAction(qa)}
                            style={{
                              backgroundColor: '#f0fdf4',
                              border: '1px solid #bbf7d0',
                              color: '#0f5132',
                              borderRadius: '9999px',
                              padding: '0.25rem 0.65rem',
                              fontSize: '0.78rem',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            {qa}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {loading && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                  <CircularProgress size={16} style={{ color: '#0f5132' }} />
                  <span>Checking deterministic scheme rules...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Pills (EXACT REPLICA OF SCREENSHOT 3) */}
            <div style={{
              padding: '0 1.5rem 0.85rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}>
              <button
                onClick={() => handleQuickAction(t('quick_find_schemes'))}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  color: '#475569',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {t('quick_find_schemes')}
              </button>

              <button
                onClick={() => handleQuickAction(t('quick_check_eligibility'))}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  color: '#475569',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {t('quick_check_eligibility')}
              </button>

              <button
                onClick={() => handleQuickAction(t('quick_nearby_partners'))}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  color: '#475569',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {t('quick_nearby_partners')}
              </button>

              <button
                onClick={() => handleQuickAction(t('quick_calculate_assistance'))}
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.85rem',
                  fontSize: '0.82rem',
                  color: '#475569',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {t('quick_calculate_assistance')}
              </button>
            </div>

            {/* Input Bar Matching Screenshot 3 (Mic + Text + Green > Button) */}
            <div style={{
              padding: '0.85rem 1.25rem',
              borderTop: '1px solid #f1f5f9',
              backgroundColor: '#ffffff'
            }}>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '0.35rem 0.45rem 0.35rem 1rem'
                }}
              >
                {/* Microphone Icon Button */}
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  title="Voice Input (Speech-to-Text)"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '0.65rem',
                    color: isListening ? '#dc2626' : '#64748b'
                  }}
                >
                  {isListening ? (
                    <MicOff size={20} color="#dc2626" className="animate-pulse" />
                  ) : (
                    <Mic size={20} color="#64748b" />
                  )}
                </button>

                {/* Input Text Box */}
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={isListening ? "Listening... speak now in EN, HI or MR" : t('input_placeholder')}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.92rem',
                    color: '#111827',
                    backgroundColor: 'transparent'
                  }}
                />

                {/* Green Arrow Button (matching Screenshot 3) */}
                <button
                  type="submit"
                  disabled={!inputText.trim() || loading}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    backgroundColor: inputText.trim() ? '#0f5132' : '#cbd5e1',
                    color: '#ffffff',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: inputText.trim() ? 'pointer' : 'default',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

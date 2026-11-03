import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, User, Bot, CheckCircle2, Calendar } from 'lucide-react';
import { BusinessConfig, ChatMessage, Lead } from '../types';
import { saveLeadToFirestore } from '../services/firebaseDb';

interface AiChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BusinessConfig;
  initialMessage?: string;
  onLeadCreated: (lead: Lead) => void;
}

export function AiChatModal({ isOpen, onClose, config, initialMessage, onLeadCreated }: AiChatModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: config.aiReceptionist.welcomeMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [extractedLeadData, setExtractedLeadData] = useState<Partial<Lead>>({});
  const [leadSaved, setLeadSaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialMessage && isOpen) {
      handleSendMessage(initialMessage);
    }
  }, [initialMessage, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ sender: m.sender, text: m.text }))
        })
      });

      const data = await res.json();
      
      const assistantMsg: ChatMessage = {
        id: `asst-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I'd be glad to assist further with your landscape project.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);

      if (data.extractedData) {
        const merged = { ...extractedLeadData, ...data.extractedData };
        setExtractedLeadData(merged);

        // If we have minimum required lead info (name, email, service), auto-save lead
        if (merged.customerName && merged.email && !leadSaved) {
          saveLeadToBackend(merged);
        }
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: "I'm having a brief connection issue. Please feel free to use our estimate form or call us directly at (415) 890-4200.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveLeadToBackend = async (data: Partial<Lead>) => {
    try {
      const leadPayload = {
        businessId: config.businessId,
        customerName: data.customerName || 'AI Chat Visitor',
        email: data.email || 'visitor@example.com',
        phone: data.phone || '(Not provided)',
        projectType: data.projectType || config.services[0].title,
        projectDescription: data.projectDescription || 'Discussed via AI Assistant',
        projectCity: data.projectCity || 'San Francisco',
        projectZip: data.projectZip || '94111',
        budgetRange: data.budgetRange || '$50,000 - $100,000',
        desiredTimeline: data.desiredTimeline || 'Flexible',
        source: 'AI Assistant',
        qualificationStatus: 'Qualified' as const,
        bookingStatus: 'Not Booked' as const,
        jobStatus: 'Estimate Sent' as const,
        paymentStatus: 'Pending' as const,
        commissionStatus: 'Not Payable' as const
      };

      const [res] = await Promise.all([
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadPayload)
        }),
        saveLeadToFirestore(leadPayload).catch(err => console.error('Firestore chat save error:', err))
      ]);

      if (res.ok) {
        const savedLead: Lead = await res.json();
        setLeadSaved(true);
        onLeadCreated(savedLead);
      }
    } catch (e) {
      console.error('Error auto-saving lead from chat:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col h-[650px]">
        {/* Modal Header */}
        <div className="bg-[#1E3A2F] text-white p-4 sm:p-6 flex items-center justify-between border-b border-[#2C4A3E]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src={config.aiReceptionist.avatar} 
                alt={config.aiReceptionist.name} 
                className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#1E3A2F] rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-lg text-white">{config.aiReceptionist.name}</h3>
                <span className="bg-[#D4AF37] text-[#1E3A2F] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">AI Concierge</span>
              </div>
              <p className="text-xs text-[#D4AF37]">{config.aiReceptionist.title} • Aravat Landscaping</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white bg-[#2C4A3E] p-2 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Captured Notification Banner */}
        {leadSaved && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-4 py-2.5 text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Project lead successfully qualified and saved to secure CRM system.</span>
            </div>
            <span className="font-mono bg-emerald-200/60 px-2 py-0.5 rounded text-[10px]">Saved</span>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#F9F8F6]">
          {messages.map((m) => (
            <div 
              key={m.id}
              className={`flex items-start gap-3 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-[#1E3A2F] text-white' : 'bg-[#D4AF37] text-[#1E3A2F]'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                m.sender === 'user' 
                  ? 'bg-[#1E3A2F] text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
              }`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
                <span className={`block text-[10px] mt-1 text-right ${m.sender === 'user' ? 'text-gray-300' : 'text-gray-400'}`}>
                  {m.timestamp}
                </span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#1E3A2F] flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-4 rounded-tl-none text-xs text-gray-500 flex items-center gap-2 shadow-sm">
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin" />
                <span>Mateo is formulating expert design advice...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Prompts */}
        <div className="px-4 py-2 bg-white border-t border-gray-100 flex gap-2 overflow-x-auto text-xs">
          <button 
            onClick={() => handleSendMessage("I am interested in a custom outdoor kitchen and patio in Palo Alto.")}
            className="cursor-pointer whitespace-nowrap bg-[#F9F8F6] hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200"
          >
            🏡 Outdoor Kitchen & Patio
          </button>
          <button 
            onClick={() => handleSendMessage("What is your timeline for a landscape master plan in Mill Valley?")}
            className="cursor-pointer whitespace-nowrap bg-[#F9F8F6] hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200"
          >
            📐 Master Architecture Plan
          </button>
          <button 
            onClick={() => handleSendMessage("How do I schedule an onsite consultation?")}
            className="cursor-pointer whitespace-nowrap bg-[#F9F8F6] hover:bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200"
          >
            📅 Schedule Consultation
          </button>
        </div>

        {/* Chat Input Footer */}
        <div className="p-4 bg-white border-t border-gray-200 flex items-center gap-3">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your landscaping project details..."
            className="flex-1 bg-[#F9F8F6] border border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#1E3A2F]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={loading || !input.trim()}
            className="cursor-pointer bg-[#1E3A2F] hover:bg-[#2C4A3E] text-white p-3 rounded-xl transition-all disabled:opacity-50 shadow"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your ChopWell AI assistant. Ask me anything about Nigerian ingredients, substitutions, or cooking tips!" }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })), { role: 'user', parts: [{ text: input }] }],
        config: {
          systemInstruction: "You are an expert chef specializing in African (especially Nigerian) cuisine. You help users with recipe substitutions, healthy variations of traditional dishes, and cooking tips. Your tone is warm, encouraging, and artisanal. Refer to the 'ChopWell' community where appropriate. Keep responses concise but helpful.",
        },
      });

      const assistantMessage: Message = { role: 'assistant', content: response.text || "I'm sorry, I couldn't process that. Try again!" };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Something went wrong. Please check your internet connection." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-forest text-white rounded-full shadow-2xl flex items-center justify-center z-[100] group"
      >
        <Sparkles className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta rounded-full flex items-center justify-center text-[10px] font-bold animate-pulse">AI</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-32 right-8 w-[400px] max-h-[600px] bg-parchment rounded-[32px] shadow-2xl overflow-hidden flex flex-col border border-sep z-[100]"
          >
            {/* Header */}
            <div className="bg-forest p-6 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-forest">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-serif text-xl tracking-tight leading-none">Kitchen Assist</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-60">AI Specialist</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:rotate-90 transition-transform p-2 bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 min-h-[300px]"
            >
              {messages.map((m, i) => (
                <div 
                  key={i}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-terracotta text-white rounded-tr-none' 
                      : 'bg-white text-ink rounded-tl-none border border-sep'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-sep">
                    <Loader2 className="w-5 h-5 animate-spin text-gold" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-sep">
              <div className="relative flex items-center bg-parchment rounded-full px-4 py-2 border border-sep focus-within:border-terracotta transition-colors">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about a substitution..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium h-10 placeholder:text-ink/30"
                />
                <button 
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="p-2 bg-forest text-white rounded-full hover:bg-terracotta transition-all disabled:opacity-50 disabled:hover:bg-forest"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

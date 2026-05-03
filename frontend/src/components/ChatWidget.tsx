import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Loader2, Mic, MicOff, X, MessageSquare } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Namaste! I am Elector AI, your expert on the Indian Election System. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const messagesRef = useRef(messages);

  useEffect(() => {
    messagesRef.current = messages;
    if (isOpen) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: userMsg,
          history: messagesRef.current.slice(-5).filter(m => m.role !== 'error')
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', content: 'Oops! I am having trouble connecting. Please check if the backend is running.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendRef = useRef(sendMessage);
  useEffect(() => {
    handleSendRef.current = sendMessage;
  }, [sendMessage]);

  const startVoiceRecognition = useCallback(() => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      handleSendRef.current(transcript);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        alert("Microphone permission denied. Please enable it in your browser settings.");
      } else if (event.error === 'no-speech') {
        setMessages(prev => [...prev, { role: 'error', content: 'No speech detected. Please try again.' }]);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.warn("Recognition already started or error");
    }
  }, [isListening]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-[90vw] max-w-[400px] h-[600px] max-h-[75vh] flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary to-secondary flex items-center justify-between text-white">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-lg leading-tight">Elector AI</h2>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="text-xs text-white/80 font-medium">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-950/50">
              <AnimatePresence initial={false}>
                {messages.map((msg, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    key={idx} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end space-x-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`p-3.5 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-primary text-white rounded-br-none shadow-md shadow-primary/20' 
                          : msg.role === 'error'
                            ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-bl-none shadow-sm border border-red-200 dark:border-red-800'
                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-sm border border-slate-100 dark:border-slate-700'
                      }`}>
                        <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {loading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-bl-none border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
                  </div>
                </motion.div>
              )}
              <div ref={endRef} />
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <button 
                  onClick={startVoiceRecognition}
                  className={`p-2.5 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                  title={isListening ? "Listening..." : "Tap to speak"}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>
                
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                  placeholder={isListening ? "Listening..." : "Speak or type your question..."}
                  className="flex-grow bg-transparent p-2 text-sm focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                />
                
                <button 
                  onClick={() => sendMessage(input)}
                  disabled={loading || !input.trim()}
                  className="p-2.5 bg-primary text-white rounded-xl hover:bg-primary-focus transition-all disabled:opacity-50 disabled:grayscale shadow-sm"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-primary/40 transition-shadow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </motion.button>
    </>
  );
}

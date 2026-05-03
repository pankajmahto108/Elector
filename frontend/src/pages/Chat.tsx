import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Loader2, Mic, MicOff } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant' | 'error';
  content: string;
}

export default function Chat() {
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
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="max-w-5xl mx-auto h-[80vh] flex flex-col bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-all">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-primary to-secondary flex items-center justify-between text-white">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-bold text-2xl leading-tight">Elector AI Chat</h1>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-white/90 font-medium">Expert Mode Online</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-grow p-6 md:p-8 overflow-y-auto space-y-6 bg-slate-50 dark:bg-slate-950/50">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              key={idx} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-end space-x-2 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`p-5 rounded-3xl ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none shadow-lg shadow-primary/20' 
                    : msg.role === 'error'
                      ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-bl-none shadow-md border border-red-200 dark:border-red-800'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none shadow-md border border-slate-100 dark:border-slate-700'
                }`}>
                  <div className="text-[15px] md:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl rounded-bl-none border border-slate-100 dark:border-slate-700 shadow-md flex items-center space-x-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-inner">
          <button 
            onClick={startVoiceRecognition}
            className={`p-4 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30' : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            title={isListening ? "Listening..." : "Tap to speak"}
          >
            {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
            placeholder={isListening ? "Listening..." : "Speak or type your question..."}
            className="flex-grow bg-transparent p-3 text-lg focus:outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
          />
          
          <button 
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            className="p-4 bg-primary text-white rounded-xl hover:bg-primary-focus transition-all disabled:opacity-50 disabled:grayscale shadow-lg shadow-primary/30"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}

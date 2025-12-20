
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, X, Send, Bot, Sparkles, Mic, MicOff, Volume2, VolumeX, 
  ChevronDown
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import useTranslation from '../hooks/useTranslation';
import { useChatBotData } from '../contexts/ChatBotContext';

// Fix for SpeechRecognition types on window object
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ChatBotProps {
  onNavigate?: (view: string) => void;
}

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  action?: string;
}

type ChatMode = 'GENERAL' | 'REGISTRATION';

// Reg Flow is still somewhat static as it involves UI logic
const REG_FLOW = [
  { field: 'name', question: "I'll help you create your account step by step. What is your **Full Name**?", type: 'text' },
  { field: 'email', question: "Thanks. Now, what is your **Email Address**?", type: 'email' },
  { field: 'mobile', question: "Got it. Please enter your **Mobile Number** (10 digits).", type: 'mobile' },
  { field: 'gender', question: "Are you creating this for a **Male** or **Female**?", type: 'select', options: ['Male', 'Female'] },
  { field: 'dob', question: "What is your **Date of Birth**? (YYYY-MM-DD)", type: 'date' },
  { field: 'religion', question: "Which **Religion** do you follow?", type: 'select', options: ['Hindu', 'Christian', 'Muslim', 'Jain'] },
  { field: 'caste', question: "What is your **Caste**?", type: 'text' },
  { field: 'password', question: "Almost done. Choose a secure **Password**.", type: 'password' },
];

const ChatBot: React.FC<ChatBotProps> = ({ onNavigate }) => {
  const { language } = useTranslation();
  const { chatData } = useChatBotData();
  
  // Dynamic Data Selection based on Language, fall back to empty structure if undefined
  const currentData = chatData[language] || chatData['en'] || { knowledgeBase: [], navCommands: [] };

  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome! I’m your personal matrimony assistant. I can help you create an account, find matches, understand memberships, check horoscope compatibility, or guide you anywhere on the platform.", sender: 'bot' }
  ]);
  const [inputValue, setInputValue] = useState("");
  
  const [mode, setMode] = useState<ChatMode>('GENERAL');
  const [regStep, setRegStep] = useState(0);
  const [regData, setRegData] = useState<any>({});

  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
     // Reset welcome message on lang change or data load
     if (currentData.knowledgeBase.length > 0) {
        const welcomeMsg = currentData.knowledgeBase.find(k => k.id === 'kb-1')?.answer || "Hello! How can I help you?";
        setMessages([{ id: Date.now(), text: welcomeMsg, sender: 'bot' }]);
     }
     setMode('GENERAL');
  }, [language, chatData]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages, isTyping]);

  const speak = (text: string) => {
    if (!speechEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    
    const cleanText = text.replace(/\*\*/g, '').replace(/\[.*?\]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1;
    
    const voices = window.speechSynthesis.getVoices();
    let voice = voices.find(v => v.lang.startsWith(language === 'ta' ? 'ta' : 'en'));
    if (!voice && language === 'ta') voice = voices.find(v => v.lang.includes('IN') || v.name.includes('India'));
    if (!voice) voice = voices.find(v => v.lang.includes('en')); 

    if (voice) utterance.voice = voice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language === 'ta' ? 'ta-IN' : 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSend(transcript);
    };

    recognition.start();
  };

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), text, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    if (mode === 'REGISTRATION') {
      await processRegistrationStep(text);
    } else {
      await processGeneralQuery(text);
    }
  };

  const processGeneralQuery = async (text: string) => {
    const lowerText = text.toLowerCase();

    // 1. Navigation
    const navMatch = currentData.navCommands.find(cmd => cmd.keywords.some(k => lowerText.includes(k.toLowerCase())));
    if (navMatch) {
      setTimeout(() => {
        addBotResponse(navMatch.resp);
        if (onNavigate) onNavigate(navMatch.view);
      }, 600);
      return;
    }

    // 2. Knowledge Base (Exact/Partial Matches)
    const ruleMatch = currentData.knowledgeBase.find(rule => 
      rule.keywords.some(k => lowerText.includes(k.toLowerCase()))
    );

    if (ruleMatch) {
      setTimeout(() => {
        addBotResponse(ruleMatch.answer);
        if (ruleMatch.action === 'start_reg') {
             setMode('REGISTRATION');
             setRegStep(0);
             setRegData({});
             setTimeout(() => addBotResponse(REG_FLOW[0].question), 800);
        }
      }, 600);
      return;
    }

    // 3. Fallback: Astrology/Horoscope Specific or Generic
    setTimeout(() => {
      // Specific Fallback for Horoscope queries not covered in KB
      if (lowerText.includes('horoscope') || lowerText.includes('jathagam') || lowerText.includes('astrology') || lowerText.includes('star') || lowerText.includes('raasi')) {
         addBotResponse("For advanced horoscope analysis or specific jathagam questions not covered here, please connect with our Astrologer or Support Team for further assistance.");
      } else {
         // Generic Fallback
         addBotResponse("I didn’t fully understand that. I can help with account creation, matchmaking, horoscope, payments, or general guidance. Please rephrase or choose a topic.");
      }
    }, 800);
  };

  const processRegistrationStep = async (input: string) => {
    // simplified flow handling
    const currentConfig = REG_FLOW[regStep];
    const newData = { ...regData, [currentConfig.field]: input };
    setRegData(newData);

    if (regStep < REG_FLOW.length - 1) {
      setRegStep(prev => prev + 1);
      setTimeout(() => {
        let nextQ = REG_FLOW[regStep + 1].question;
        addBotResponse(nextQ);
      }, 600);
    } else {
      setTimeout(() => {
         addBotResponse("Your account details have been submitted successfully. Your profile is now under admin review. Once approved, you will receive login access via email.");
         setMode('GENERAL');
      }, 1000);
    }
  };

  const addBotResponse = (text: string) => {
    setIsTyping(false);
    setMessages(prev => [...prev, { id: Date.now(), text, sender: 'bot' }]);
    speak(text);
  };

  const WaveVisualizer = ({ isActive, color = "bg-purple-400" }: { isActive: boolean, color?: string }) => (
     <div className="flex items-center justify-center gap-1 h-4">
        {[1, 2, 3, 4, 5].map((i) => (
           <motion.div
              key={i}
              animate={isActive ? { height: [4, 16, 4] } : { height: 4 }}
              transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
              className={`w-1 rounded-full ${color}`}
           />
        ))}
     </div>
  );

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl shadow-purple-500/40 flex items-center justify-center border-2 border-white dark:border-gray-800"
      >
        <AnimatePresence mode="wait">
          {isOpen ? <X size={28} /> : <MessageSquare size={28} fill="currentColor" />}
        </AnimatePresence>
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className={`fixed bottom-24 right-4 md:right-6 z-[90] flex flex-col bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-300 ${isMinimized ? 'w-72 h-16 rounded-full' : 'w-[95vw] md:w-[400px] h-[600px] max-h-[80vh]'}`}
          >
            <div 
              className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white cursor-pointer"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <div className="flex items-center gap-3">
                 <div className="relative">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                       <Bot size={20} />
                    </div>
                    {isSpeaking && (
                       <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                          <Volume2 size={10} className="text-purple-600" />
                       </div>
                    )}
                 </div>
                 <div>
                    <h3 className="font-bold text-sm leading-tight">Divine Assistant</h3>
                    {!isMinimized && (
                       <div className="flex items-center gap-2 text-[10px] text-purple-100">
                          <Sparkles size={8} /> 
                          {mode === 'REGISTRATION' ? 'Registration Mode' : 'Online'}
                       </div>
                    )}
                 </div>
              </div>
              
              {!isMinimized && (
                 <div className="flex items-center gap-2">
                    <button 
                       onClick={(e) => { e.stopPropagation(); setSpeechEnabled(!speechEnabled); window.speechSynthesis.cancel(); }}
                       className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                    >
                       {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }}>
                       <ChevronDown size={20} />
                    </button>
                 </div>
              )}
            </div>

            {!isMinimized && (
              <>
                 <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-black/20 custom-scrollbar scroll-smooth">
                    {messages.map((msg) => (
                       <motion.div 
                          key={msg.id} 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                       >
                          <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                             msg.sender === 'user' 
                             ? 'bg-purple-600 text-white rounded-tr-none' 
                             : 'bg-white dark:bg-white/10 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-white/5'
                          }`}>
                             <span dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>') }} />
                          </div>
                       </motion.div>
                    ))}
                    
                    {isTyping && (
                       <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                          <div className="bg-white dark:bg-white/10 rounded-2xl rounded-tl-none p-3 border border-gray-100 dark:border-white/5 flex gap-1 items-center h-10">
                             <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                             <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                             <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                       </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                 </div>

                 {(isSpeaking || isListening) && (
                    <div className="h-8 bg-purple-50 dark:bg-white/5 flex items-center justify-center border-t border-gray-100 dark:border-white/5">
                        <WaveVisualizer isActive={true} color={isListening ? 'bg-red-400' : 'bg-purple-400'} />
                    </div>
                 )}
                 
                 <div className="p-3 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-white/5">
                    <form 
                       onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                       className="relative flex items-center gap-2"
                    >
                       <button 
                          type="button"
                          onClick={toggleListening}
                          className={`p-3 rounded-xl transition-all duration-300 ${
                             isListening 
                             ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 animate-pulse' 
                             : 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-purple-600'
                          }`}
                       >
                          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                       </button>

                       <input 
                          ref={inputRef}
                          type="text" 
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Type a message..."
                          className="flex-1 bg-gray-100 dark:bg-white/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500/50 outline-none text-gray-900 dark:text-white transition-all placeholder:text-gray-400"
                          disabled={isListening}
                       />
                       
                       <button 
                          type="submit"
                          disabled={!inputValue.trim() || isTyping}
                          className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20"
                       >
                          <Send size={20} />
                       </button>
                    </form>
                 </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;

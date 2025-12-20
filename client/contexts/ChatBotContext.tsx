
import React, { createContext, useContext, useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Define Data Types
export interface KnowledgeEntry {
  id: string;
  keywords: string[];
  answer: string;
  action?: string;
}

export interface NavCommand {
  id: string;
  keywords: string[];
  view: string;
  resp: string;
}

export interface ChatDataSet {
  navCommands: NavCommand[];
  knowledgeBase: KnowledgeEntry[];
}

export type ChatDataMap = Record<string, ChatDataSet>; // Keyed by language code 'en', 'ta'

// Default Data Populated from Requirements
const DEFAULT_DATA: ChatDataMap = {
  en: {
    navCommands: [
      { id: 'nav-1', keywords: ['home', 'landing'], view: 'landing', resp: "Taking you to the Home page." },
      { id: 'nav-2', keywords: ['dashboard'], view: 'dashboard', resp: "Opening your Dashboard." },
      { id: 'nav-3', keywords: ['membership', 'plans', 'pricing', 'cost'], view: 'membership-public', resp: "Opening membership plans." },
      { id: 'nav-4', keywords: ['stories', 'success'], view: 'stories', resp: "Inspiring Success Stories." },
      { id: 'nav-5', keywords: ['contact', 'support', 'help', 'where is membership', 'contact page'], view: 'contact', resp: "Opening Contact Support." },
    ],
    knowledgeBase: [
      // Greeting & Entry
      { 
        id: 'kb-1', 
        keywords: ['hi', 'hello', 'start', 'hey', 'vanakkam', 'assalamualaikum', 'namaste'], 
        answer: "Welcome! I’m your personal matrimony assistant. I can help you create an account, find matches, understand memberships, check horoscope compatibility, or guide you anywhere on the platform. Tell me what you’d like to do first." 
      },
      // Exit
      { 
        id: 'kb-exit', 
        keywords: ['exit', 'stop', 'close', 'quit', 'bye', 'end chat', 'leave'], 
        answer: "Alright. I’m always here whenever you need help in your matrimony journey. Wishing you the very best. Take care." 
      },
      // Account Creation Trigger
      { 
        id: 'kb-2', 
        keywords: ['create account', 'register', 'sign up', 'join', 'new profile'], 
        answer: "I’ll help you create your account step by step. This will take just a few minutes. Once submitted, your profile will be reviewed by our admin before activation. Let’s begin.", 
        action: 'start_reg' 
      },
      // Login Issues
      { 
        id: 'kb-3', 
        keywords: ['login not working', 'cannot login', 'access denied'], 
        answer: "Your profile is currently under admin review. Login access will be enabled only after approval. You’ll be notified via email once approved." 
      },
      // Profile Update
      { 
        id: 'kb-update', 
        keywords: ['edit profile', 'update details', 'change profile'], 
        answer: "You can update your education, career, family, lifestyle, horoscope, and photos inside your profile settings after login. Let me know which section you want to update." 
      },
      // Match Search
      { 
        id: 'kb-4', 
        keywords: ['find matches', 'search bride', 'search groom', 'match search'], 
        answer: "I can help you search matches based on age, caste, religion, location, profession, income, horoscope, or nearby distance. Tell me your preference or type a keyword." 
      },
      // Keyword Search Example
      {
        id: 'kb-keyword',
        keywords: ['it engineer', 'chennai', 'doctor'],
        answer: "Showing profiles matching your keywords. You can refine results further using filters like age, height, or horoscope compatibility inside the dashboard."
      },
      // Horoscope General
      { 
        id: 'kb-5', 
        keywords: ['horoscope match', 'porutham', 'jathagam'], 
        answer: "Our system follows South Indian Nakshatra Porutham rules. You can upload a horoscope PDF or provide birth details to check compatibility." 
      },
      // Porutham Specifics
      { 
        id: 'kb-porutham', 
        keywords: ['dina porutham', 'gana porutham', 'rajju'], 
        answer: "Nakshatra matching uses 10 poruthams such as Dina, Gana, Rajju, Yoni, and Rasi. Each porutham is evaluated as Uthamam, Mathiyamam, or Athamam to determine compatibility." 
      },
      // Payment
      { 
        id: 'kb-pay', 
        keywords: ['price', 'premium', 'gold', 'diamond', 'platinum'], 
        answer: "We offer Gold, Diamond, and Platinum plans with benefits like unlimited messaging, advanced filters, horoscope matching, and profile boosts. Would you like to compare plans?" 
      },
      // Safety
      { 
        id: 'kb-safe', 
        keywords: ['report profile', 'fake', 'abuse', 'safety'], 
        answer: "Your safety is our priority. Reported profiles are reviewed immediately. Any misuse, fake details, or inappropriate behavior may lead to account suspension or permanent blocking." 
      },
      // Admin Status
      { 
        id: 'kb-6', 
        keywords: ['approval status', 'admin review', 'status'], 
        answer: "Your profile status is under review. Approval usually takes a short time. You’ll receive an email once access is granted." 
      },
      // Activity
      { 
        id: 'kb-activity', 
        keywords: ['who viewed me', 'shortlisted me', 'activity'], 
        answer: "You can view profile visits, likes, interests, and shortlist activity inside your dashboard once your account is active." 
      }
    ]
  },
  ta: {
    navCommands: [
      { id: 'nav-ta-1', keywords: ['முகப்பு', 'home'], view: 'landing', resp: "உங்களை முகப்புப் பக்கத்திற்கு அழைத்துச் செல்கிறேன்." },
      { id: 'nav-ta-2', keywords: ['டாஷ்போர்டு', 'dashboard'], view: 'dashboard', resp: "உங்கள் டாஷ்போர்டைத் திறக்கிறேன்." },
      { id: 'nav-ta-3', keywords: ['உறுப்பினர்', 'membership'], view: 'membership-public', resp: "உறுப்பினர் பக்கத்தைத் திறக்கிறேன்." },
    ],
    knowledgeBase: [
      { id: 'kb-ta-1', keywords: ['வணக்கம்', 'hi'], answer: "வணக்கம்! நான் உங்கள் திருமண உதவியாளர். கணக்கு உருவாக்க அல்லது வரன் தேட நான் உதவ முடியும்." },
      { id: 'kb-ta-2', keywords: ['பதிவு', 'register'], answer: "உங்கள் கணக்கை உருவாக்க நான் உதவுகிறேன். ஆரம்பிக்கலாம்.", action: 'start_reg' },
      { id: 'kb-ta-3', keywords: ['தேடல்', 'search'], answer: "வயது, ஜாதி, மதம் அல்லது ஊர் அடிப்படையில் வரன் தேட நான் உதவ முடியும்." },
      { id: 'kb-ta-4', keywords: ['ஜாதகம்', 'horoscope'], answer: "எங்கள் தளம் நட்சத்திரப் பொருத்த விதிகளைப் பின்பற்றுகிறது." },
    ]
  }
};

interface ChatBotContextType {
  chatData: ChatDataMap;
  addKnowledgeEntry: (lang: string, entry: Omit<KnowledgeEntry, 'id'>) => void;
  updateKnowledgeEntry: (lang: string, entry: KnowledgeEntry) => void;
  deleteKnowledgeEntry: (lang: string, id: string) => void;
  addNavCommand: (lang: string, entry: Omit<NavCommand, 'id'>) => void;
  updateNavCommand: (lang: string, entry: NavCommand) => void;
  deleteNavCommand: (lang: string, id: string) => void;
  resetToDefaults: () => void;
}

const ChatBotContext = createContext<ChatBotContextType | undefined>(undefined);

export const ChatBotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatData, setChatData] = useLocalStorage<ChatDataMap>('mdm_chatbot_data', DEFAULT_DATA);

  // --- ACTIONS ---

  const addKnowledgeEntry = (lang: string, entry: Omit<KnowledgeEntry, 'id'>) => {
    const newEntry = { ...entry, id: `kb-${Date.now()}` };
    setChatData(prev => {
        const langData = prev[lang] || { knowledgeBase: [], navCommands: [] };
        return {
          ...prev,
          [lang]: {
            ...langData,
            knowledgeBase: [newEntry, ...langData.knowledgeBase]
          }
        };
    });
  };

  const updateKnowledgeEntry = (lang: string, entry: KnowledgeEntry) => {
    setChatData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        knowledgeBase: prev[lang].knowledgeBase.map(item => item.id === entry.id ? entry : item)
      }
    }));
  };

  const deleteKnowledgeEntry = (lang: string, id: string) => {
    setChatData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        knowledgeBase: prev[lang].knowledgeBase.filter(item => item.id !== id)
      }
    }));
  };

  const addNavCommand = (lang: string, entry: Omit<NavCommand, 'id'>) => {
    const newEntry = { ...entry, id: `nav-${Date.now()}` };
    setChatData(prev => {
        const langData = prev[lang] || { knowledgeBase: [], navCommands: [] };
        return {
          ...prev,
          [lang]: {
            ...langData,
            navCommands: [newEntry, ...langData.navCommands]
          }
        };
    });
  };

  const updateNavCommand = (lang: string, entry: NavCommand) => {
    setChatData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        navCommands: prev[lang].navCommands.map(item => item.id === entry.id ? entry : item)
      }
    }));
  };

  const deleteNavCommand = (lang: string, id: string) => {
    setChatData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        navCommands: prev[lang].navCommands.filter(item => item.id !== id)
      }
    }));
  };

  const resetToDefaults = () => {
    setChatData(DEFAULT_DATA);
  };

  return (
    <ChatBotContext.Provider value={{ 
      chatData, 
      addKnowledgeEntry, updateKnowledgeEntry, deleteKnowledgeEntry,
      addNavCommand, updateNavCommand, deleteNavCommand,
      resetToDefaults
    }}>
      {children}
    </ChatBotContext.Provider>
  );
};

export const useChatBotData = () => {
  const context = useContext(ChatBotContext);
  if (context === undefined) {
    throw new Error('useChatBotData must be used within a ChatBotProvider');
  }
  return context;
};

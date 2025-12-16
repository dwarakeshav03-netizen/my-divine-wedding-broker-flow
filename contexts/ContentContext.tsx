
import React, { createContext, useContext, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

// Default content matches the current hardcoded values
const defaultContent = {
  general: {
    appName: "My Divine Wedding",
    logoText: "DW",
    adminEmail: "admin@divine.com"
  },
  hero: {
    badge: "Tamil Nadu's No 1 Matrimony",
    titleLine1: "Divine",
    titleLine2: "Connections",
    subtitle: "Start here.",
    description: "Experience the future of matchmaking. Where ancient tradition meets modern technology to find your perfect soulmate.",
    ctaText: "Join for Free"
  },
  features: {
    badge: "Premium Benefits",
    title: "Why Choose Us?"
  },
  stories: {
    badge: "Happily Ever After",
    title: "Real Stories",
    description: "Thousands of couples have found their soulmates here. Yours could be next."
  },
  contact: {
    badge: "Get in Touch",
    title: "We're Here to Help",
    description: "Have questions about our premium matchmaking services? Reach out to our dedicated support team.",
    phone: "9087549000, 9025159000",
    email: "help@mydivinewedding.com",
    address: "Yogiar Illam, Flat No. T3, Third Floor, Rajaji Street, Saligramam, Chennai - 93",
    officeTime: "Mon-Sat, 9AM - 7PM"
  },
  footer: {
    about: "The most trusted and premium matchmaking service for Tamilians worldwide.",
    copyright: "2024 My Divine Wedding. All rights reserved."
  },
  company: {
     title: "About Us",
     heroTitle: "About",
     heroHighlight: "Us",
     description: "We are more than just a matchmaking platform. We are the custodians of tradition, blending ancient values with modern technology to build happy families.",
     missionTitle: "Our Mission",
     missionDesc: "To provide a safe, secure, and culturally aligned platform where every Tamilian can find their perfect life partner, irrespective of boundaries."
  },
  faq: {
     title: "Frequently Asked Questions",
     subtitle: "Find answers to common questions about your account, safety, and our premium services."
  }
};

export type SiteContent = typeof defaultContent;

interface ContentContextType {
  content: SiteContent;
  updateContent: (section: keyof SiteContent, data: any) => void;
  resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [content, setContent] = useLocalStorage<SiteContent>('mdm_site_content', defaultContent);

  const updateContent = (section: keyof SiteContent, data: any) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const resetContent = () => {
    setContent(defaultContent);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

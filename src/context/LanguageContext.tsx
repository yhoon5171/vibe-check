'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from '../dictionaries/en.json';
import ko from '../dictionaries/ko.json';
import ja from '../dictionaries/ja.json';
import zh from '../dictionaries/zh.json';

const dictionaries = { en, ko, ja, zh };
export type Language = keyof typeof dictionaries;

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (keys: string, ...args: (string | number)[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    // Auto-detect browser language on mount
    const browserLang = navigator.language.slice(0, 2);
    if (browserLang in dictionaries) {
      setLang(browserLang as Language);
    }
  }, []);

  const t = (keys: string, ...args: (string | number)[]) => {
    const keysArray = keys.split('.');
    let value: any = dictionaries[lang];
    
    for (const key of keysArray) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return keys; // fallback if key not found
      }
    }
    
    if (typeof value === 'string') {
      let formatted = value;
      args.forEach((arg, index) => {
        formatted = formatted.replace(`{${index}}`, String(arg));
      });
      return formatted;
    }
    
    return keys;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

import React, { createContext, useContext, useState } from 'react';

export const translations = {
  English: { welcome: "Welcome", search: "Search crops...", add: "ADD", items: "Items" },
  हिंदी: { welcome: "स्वागत है", search: "ताज़ी फसलें खोजें...", add: "जोड़ें", items: "आइटम" }
};

const AppContext = createContext<any>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState('English');
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [user, setUser] = useState(null); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState<{ [key: string]: { quantity: number, price: number, name: string } }>({});
  
  const t = translations[language as keyof typeof translations];

  return (
    <AppContext.Provider value={{ language, setLanguage, isTtsEnabled, setIsTtsEnabled, user, setUser, isLoggedIn, setIsLoggedIn, cart, setCart, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);

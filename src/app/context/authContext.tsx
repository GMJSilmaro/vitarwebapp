// context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/app/firebase/config"; // Adjust the import path
import { onAuthStateChanged, User } from "firebase/auth";

// Create a context
const AuthContext = createContext<User | null>(null);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

// Create a custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

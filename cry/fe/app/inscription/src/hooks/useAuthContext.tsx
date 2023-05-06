import React, { useContext, createContext } from 'react';

interface AuthContext {
  authes: string[];
}

export const AuthContext = createContext<AuthContext>({
  authes: [],
});

interface AuthProvider {
  auth: string[];
  children: React.ReactNode;
}

export const AuthProvider = ({ auth, children }: AuthProvider) => {
  return <AuthContext.Provider value={{ authes: auth }}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useContext(AuthContext);

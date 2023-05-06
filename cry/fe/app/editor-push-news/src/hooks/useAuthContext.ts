import { useContext, createContext } from 'react';

type AuthContext = {
  editor_authes: string[];
  tool_authes: number[];
}

const InitialAuthContext: AuthContext = {
  editor_authes: [],
  tool_authes: []
}

export const AuthContext = createContext<AuthContext>(InitialAuthContext);

export const AuthProvider = AuthContext.Provider;

export const useAuthContext = (key: "editor" | "tools") => {
  const { editor_authes, tool_authes } = useContext<AuthContext>(AuthContext);

  if (key === "tools") {
    return tool_authes
  }

  if (key && editor_authes) {
    return editor_authes
  }
}

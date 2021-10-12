// src/AuthProvider.tsx
import React from "react";
import { IUser } from "../interfaces";
import useLocalStorage from "../hooks/useLocalStorage.hook";

type ContextProps = {
  user: IUser | null;
  setUser: any;
  token: string | null;
  setToken: (value: string) => void;
};

export const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useLocalStorage<IUser | null>("user", null);
  const [token, setToken] = useLocalStorage<string | null>("token", null);

  React.useEffect(() => {
    if (user && user.token) {
      setToken(user.token);
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

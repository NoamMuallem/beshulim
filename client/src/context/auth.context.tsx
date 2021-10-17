// src/AuthProvider.tsx
import React from "react";
import { IUser } from "../interfaces";
import useLocalStorage from "../hooks/useLocalStorage.hook";

type ContextProps = {
  user: IUser | undefined;
  setUser: any;
  token: string | null;
  setToken: (value: string) => void;
};

export const AuthContext = React.createContext<Partial<ContextProps>>({});

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useLocalStorage<IUser | undefined>("user", undefined);
  const [token, setToken] = useLocalStorage<string | null>("token", null);

  React.useEffect(() => {
    if (user && user.token) {
      setToken(user.token);
    }
  }, [user, setToken]);

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

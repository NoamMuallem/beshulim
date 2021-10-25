// src/AuthProvider.tsx
import React from "react";
import useWindowSize from "../hooks/windowSize.hook";

type ContextProps = {
  Screen: { width: number; height: number };
};

export const UiContext = React.createContext<Partial<ContextProps>>({});

export const UiProvider = ({ children }: any) => {
  const Screen = useWindowSize();

  return (
    <UiContext.Provider
      value={{
        Screen,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

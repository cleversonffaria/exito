import { createContext, useContext } from "react";
import { NCodeInputAtom } from "./code-input-atom.types";

export const CodeInputContext = createContext<NCodeInputAtom.ContextValue>(
  {} as NCodeInputAtom.ContextValue
);

export function useCodeInputContext() {
  const context = useContext(CodeInputContext);

  if (!context) {
    throw new Error(
      "useCodeInputContext must be used within a CodeInputProvider"
    );
  }

  return context;
}

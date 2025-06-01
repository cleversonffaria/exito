import { createContext, useContext } from "react";

import { devWarning } from "@/utils/dev-warnings";

import { NInputAtom } from "./input-atom.types";

export const InputContext = createContext<NInputAtom.ContextValue | null>(null);

export const useInputContext = (): NInputAtom.ContextValue => {
  const context = useContext(InputContext);

  if (!context) {
    devWarning.contextMissing("de entrada", "Input.Root");

    return {
      variant: "default",
      size: "md",
      disabled: false,
      focused: false,
      setFocused: () => {
        devWarning.functionCalledOutsideContext("setFocused", "Input.Root");
      },
      error: undefined,
    };
  }

  return context;
};

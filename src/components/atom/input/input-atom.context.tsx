import { createContext, useContext } from "react";

import { devWarning } from "@utils/dev-warnings.utils";

import { NInputAtom } from "./input-atom.types";

const InputContext = createContext<NInputAtom.ContextValue | null>(null);

export const useInputContext = (): NInputAtom.ContextValue => {
  const context = useContext(InputContext);

  if (!context) {
    devWarning.contextMissing("de entrada", "InputAtom.Root");
    return {
      variant: "default",
      size: "md",
      disabled: false,
      focused: false,
      error: undefined,
      setFocused: () =>
        devWarning.functionCalledOutsideContext("setFocused", "InputAtom.Root"),
    };
  }

  return context;
};

export { InputContext };

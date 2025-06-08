import { CodeInputController } from "./code-input-atom.controller";
import { CodeInputError } from "./code-input-atom.error";
import { CodeInputField } from "./code-input-atom.field";
import { CodeInputLabel } from "./code-input-atom.label";
import { CodeInputRoot } from "./code-input-atom.root";

export { useCodeInputContext } from "./code-input-atom.context";
export type { NCodeInputAtom } from "./code-input-atom.types";
export { codeInputVariants } from "./code-input-atom.variant";

export const CodeInputAtom = {
  Root: CodeInputRoot,
  Label: CodeInputLabel,
  Field: CodeInputField,
  Error: CodeInputError,
  Controller: CodeInputController,
};

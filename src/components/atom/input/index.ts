import { InputController } from "./input-atom.controlled";
import { InputError } from "./input-atom.error";
import { InputField } from "./input-atom.field";
import { InputLabel } from "./input-atom.label";
import { InputRoot } from "./input-atom.root";

export { useInputContext } from "./input-atom.context";
export { NInputAtom } from "./input-atom.types";
export { inputVariants } from "./input-atom.variant";

export const Input = {
  Root: InputRoot,
  Label: InputLabel,
  Field: InputField,
  Error: InputError,
  Controlled: InputController,
};

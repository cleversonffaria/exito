import { tv } from "tailwind-variants";

export const inputVariants = tv({
  slots: {
    container: "",
    label: "font-semibold",
    input:
      "w-full rounded-xl px-4 text-base border my-2 ring-0 ring-transparent bg-gym-black-400",
    errorText: "min-h-5",
  },
  variants: {
    variant: {
      default: {
        label: "text-gym-gray-300",
        input: "border-gym-gray-700 text-white placeholder:text-gym-gray-400",
      },
      glass: {
        label: "text-gym-gray-400",
        input:
          "border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder:text-gym-gray-400",
      },
    },
    hasError: {
      true: {
        label: "text-gym-error-400",
        input: "border-gym-error-400",
        errorText: "text-gym-error-400",
      },
      false: {},
    },
    size: {
      xs: {
        label: "text-xs",
        input: "h-10 text-xs",
        errorText: "text-xs min-h-4",
      },
      sm: {
        label: "text-sm",
        input: "h-12 text-sm",
        errorText: "text-xs min-h-4",
      },
      md: {
        label: "text-base",
        input: "h-14 pb-1 text-base",
        errorText: "text-sm min-h-5",
      },
      lg: {
        label: "text-lg",
        input: "h-16 text-lg",
        errorText: "text-sm min-h-5",
      },
    },
    disabled: {
      true: {
        input: "bg-gym-gray-200 text-gym-gray-500",
        label: "text-gym-gray-500",
      },
    },
    focused: {
      true: {
        input: "border-gym-primary-500 ring-2 ring-gym-primary-500/20",
      },
    },
  },
  compoundVariants: [
    {
      variant: "default",
      hasError: true,
      class: {
        input: "bg-gym-black-400",
      },
    },
    {
      variant: "glass",
      hasError: true,
      class: {
        input: "bg-white/15 backdrop-blur-sm",
      },
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    hasError: false,
  },
});

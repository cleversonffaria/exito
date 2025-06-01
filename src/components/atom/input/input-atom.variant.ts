import { tv } from "tailwind-variants";

export const inputVariants = tv({
  slots: {
    container: "mb-5",
    label: "font-semibold",
    input: "w-full rounded-xl px-4 text-base border my-2",
    errorText: "",
  },
  variants: {
    variant: {
      default: {
        label: "text-gray-800",
        input: "border-gray-400 bg-gray-50 text-gray-900",
      },
      glass: {
        label: "text-gray-400",
        input:
          "border-white/30 bg-white/15 backdrop-blur-sm text-white placeholder:text-gray-400",
      },
      error: {
        label: "text-error-400",
        input:
          "border-error-400 bg-white/15 backdrop-blur-sm text-white placeholder:text-gray-400",
        errorText: "text-error-400",
      },
    },
    size: {
      xs: {
        label: "text-xs",
        input: "h-10 text-xs",
        errorText: "text-xs",
      },
      sm: {
        label: "text-sm",
        input: "h-12 text-sm",
        errorText: "text-xs",
      },
      md: {
        label: "text-base",
        input: "h-14 text-base",
        errorText: "text-sm",
      },
      lg: {
        label: "text-lg",
        input: "h-16 text-lg",
        errorText: "text-sm",
      },
    },
    disabled: {
      true: {
        input: "bg-gray-200 text-gray-500",
        label: "text-gray-500",
      },
    },
    focused: {
      true: {
        input: "border-primary-500 ring-2 ring-primary-500/20",
      },
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

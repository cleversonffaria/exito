import { tv } from "tailwind-variants";

export const inputVariants = tv({
  slots: {
    container:
      "bg-gym-black-400 rounded-xl px-4 text-base border w-full flex-row items-center gap-3",
    label: "font-semibold",
    input: "flex-1 text-base",
    errorText: "min-h-4",
  },
  variants: {
    variant: {
      default: {
        label: "text-gym-gray-300",
        container: "border-gym-gray-700",
        input: "text-white placeholder:text-gym-gray-400",
      },
      glass: {
        label: "text-gym-gray-400",
        container: "border-white/30 bg-white/15 backdrop-blur-sm ",
        input: "text-white placeholder:text-gym-gray-400",
      },
    },
    hasError: {
      true: {
        label: "text-gym-error-400",
        container: "border-gym-error-400",
        errorText: "text-gym-error-400",
      },
      false: {},
    },
    size: {
      xs: {
        label: "text-xs",
        container: "h-10",
        input: "text-xs",
        errorText: "text-xs min-h-4",
      },
      sm: {
        label: "text-sm",
        container: "h-12",
        input: "text-sm",
        errorText: "text-xs min-h-4",
      },
      md: {
        label: "text-base",
        container: "h-14",
        input: "text-base",
        errorText: "text-sm min-h-5",
      },
      lg: {
        label: "text-lg",
        container: "h-16",
        input: "text-lg",
        errorText: "text-sm min-h-5",
      },
    },
    disabled: {
      true: {
        input: "text-gym-gray-500",
        container: "opacity-90",
        label: "text-gym-gray-500",
      },
    },
    focused: {
      true: {
        container: "border-gym-primary-500",
      },
    },
  },
  compoundVariants: [
    {
      variant: "default",
      hasError: true,
      class: {
        container: "bg-gym-black-400",
      },
    },
    {
      variant: "glass",
      hasError: true,
      class: {
        container: "bg-white/15 backdrop-blur-sm",
      },
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    hasError: false,
  },
});

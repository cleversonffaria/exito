import { tv } from "tailwind-variants";

export const codeInputVariants = tv({
  slots: {
    container: "",
    label: "font-semibold text-center mb-4 text-lg",
    field: "flex-row justify-center gap-3",
    cell: "w-14 h-14 mx-2 text-center border justify-center items-center rounded-lg bg-gym-gray-500",
    cellText: "text-white font-bold text-2xl pb-1",
    errorText: "min-h-5",
  },
  variants: {
    variant: {
      default: {
        label: "text-gym-gray-300",
        cell: "border-gym-gray-600 bg-gym-gray-800",
      },
      glass: {
        label: "text-gym-gray-400",
        cell: "border-white/30 bg-white/10 backdrop-blur-sm",
      },
    },
    hasError: {
      true: {
        label: "text-gym-error-400",
        cell: "border-gym-error-400",
        errorText: "text-gym-error-400",
      },
      false: {},
    },
    size: {
      sm: {
        cell: "w-12 h-12",
        cellText: "text-xl",
      },
      md: {
        cell: "w-14 h-14",
        cellText: "text-2xl",
      },
      lg: {
        cell: "w-16 h-16",
        cellText: "text-3xl",
      },
    },
    focused: {
      true: {
        cell: "border-gym-primary-500 ring-2 ring-gym-primary-500/20",
      },
    },
  },
  compoundVariants: [
    {
      variant: "default",
      hasError: true,
      class: {
        cell: "bg-gym-gray-800 border-gym-error-400",
      },
    },
    {
      variant: "glass",
      hasError: true,
      class: {
        cell: "bg-white/10 backdrop-blur-sm border-gym-error-400",
      },
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "md",
    hasError: false,
  },
});

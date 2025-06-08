import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  slots: {
    root: "w-full rounded-xl items-center justify-center",
    text: "font-semibold",
  },
  variants: {
    variant: {
      primary: {
        root: "bg-gym-primary-500",
        text: "text-gym-black-500",
      },
      error: {
        root: "bg-gym-error-400",
        text: "text-white",
      },
      none: {
        root: "bg-transparent",
        text: "text-gym-gray-300",
      },
    },
    size: {
      xs: {
        root: "h-10 px-2",
        text: "text-xs",
      },
      sm: {
        root: "h-12 px-4",
        text: "text-sm",
      },
      md: {
        root: "h-14 px-6",
        text: "text-lg",
      },
      lg: {
        root: "h-16 px-8",
        text: "text-xl",
      },
    },
    outline: {
      true: {
        root: "bg-transparent",
      },
    },
    disabled: {
      true: {
        root: "bg-gym-black-400",
        text: "text-gym-gray-500",
      },
    },
    loading: {
      true: {
        root: "bg-gym-black-400",
        text: "text-gym-gray-500",
      },
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      outline: true,
      class: {
        root: "border-gym-primary-500",
        text: "text-gym-primary-500",
      },
    },
    {
      variant: "error",
      outline: true,
      class: {
        root: "border-gym-error-400",
        text: "text-gym-error-400",
      },
    },
    {
      variant: "none",
      disabled: true,
      class: {
        root: "bg-transparent",
        text: "text-gym-gray-300",
      },
    },
    {
      variant: "none",
      loading: true,
      class: {
        root: "bg-transparent",
        text: "text-gym-gray-300",
      },
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

import { tv } from "tailwind-variants";

export const buttonVariants = tv({
  slots: {
    root: "w-full rounded-xl items-center justify-center",
    text: "font-semibold",
  },
  variants: {
    variant: {
      primary: {
        root: "bg-primary-500",
        text: "text-black-500",
      },
      error: {
        root: "bg-error-400",
        text: "text-white",
      },
      none: {
        root: "bg-transparent",
        text: "text-gray-300",
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
        root: "bg-black-400",
        text: "text-gray-500",
      },
    },
    loading: {
      true: {
        root: "bg-black-400",
        text: "text-gray-500",
      },
    },
  },
  compoundVariants: [
    {
      variant: "primary",
      outline: true,
      class: {
        root: "border-primary-500",
        text: "text-primary-500",
      },
    },
    {
      variant: "error",
      outline: true,
      class: {
        root: "border-error-400",
        text: "text-error-400",
      },
    },
    {
      variant: "none",
      disabled: true,
      class: {
        root: "bg-transparent",
        text: "text-gray-300",
      },
    },
    {
      variant: "none",
      loading: true,
      class: {
        root: "bg-transparent",
        text: "text-gray-300",
      },
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

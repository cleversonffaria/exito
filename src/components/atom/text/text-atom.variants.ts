import { tv } from "tailwind-variants";

export const textVariants = tv({
  base: "font-Epilogue",
  variants: {
    size: {
      xxs: "text-[10px]", // 10px
      xs: "text-xs", // 12px
      sm: "text-sm", // 14px
      base: "text-base", // 16px
      lg: "text-lg", // 18px
      xl: "text-xl", // 20px
      "2xl": "text-2xl", // 24px
      "3xl": "text-[30px]", // 30px
      "4xl": "text-4xl", // 36px
      "5xl": "text-[40px]", // 40px
      "6xl": "text-5xl", // 48px
      "7xl": "text-[56px]", // 56px
    },
  },
  defaultVariants: {
    size: "base",
  },
});

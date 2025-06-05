import GymIcon from "@assets/svg/gym.svg";
import HomeIcon from "@assets/svg/home.svg";
import ProfileIcon from "@assets/svg/profile.svg";

export const TAB_BAR_ICONS = {
  home: HomeIcon,
  training: GymIcon,
  profile: ProfileIcon,
} as const;

export const TAB_BAR_LABELS = {
  home: "Início",
  training: "Treino",
  profile: "Perfil",
} as const;

export type TabKey = keyof typeof TAB_BAR_ICONS;

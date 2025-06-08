import { NButtonAtom } from "@/components/atom/button/button-atom.types";
import { create } from "zustand";

export interface ModalAction
  extends Omit<NButtonAtom.RootProps, "children" | "onPress"> {
  title: string;
  onPress: () => void;
}

export interface ModalConfig {
  title?: string;
  description?: string;
  content?: React.ComponentType<any> | React.ReactElement;
  actions?: ModalAction[];
  onDismiss?: () => void;
  snapPoint?: number;
  adjustToContentHeight?: boolean;
}

interface ModalState {
  isVisible: boolean;
  config: ModalConfig | null;
  modalRef: any;
  setModalRef: (ref: any) => void;
  show: (config: ModalConfig) => void;
  hide: () => void;
  reset: () => void;
}

export const useModal = create<ModalState>((set, get) => ({
  isVisible: false,
  config: null,
  modalRef: null,

  setModalRef: (ref: any) => {
    set({ modalRef: ref });
  },

  show: (config: ModalConfig) => {
    set({ config, isVisible: true });
    const { modalRef } = get();
    if (modalRef) {
      modalRef.open();
    }
  },

  hide: () => {
    const { modalRef, isVisible } = get();
    if (modalRef && isVisible) {
      set({ isVisible: false });
      modalRef.close();
    }
  },

  reset: () => {
    set({ config: null, isVisible: false });
  },
}));

export const modal = {
  show: (config: ModalConfig) => useModal.getState().show(config),
  hide: () => useModal.getState().hide(),
  reset: () => useModal.getState().reset(),
};

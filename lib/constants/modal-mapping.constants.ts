import { InteractiveTarget, ModalType } from "@/lib/types";

export const MODAL_MAP: Partial<Record<InteractiveTarget, ModalType>> = {
  [InteractiveTarget.About]: ModalType.About,
  [InteractiveTarget.Contact]: ModalType.Contact,
  [InteractiveTarget.CV]: ModalType.CV,
} as const;

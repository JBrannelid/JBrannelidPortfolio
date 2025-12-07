export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface ExternalLinkModalProps {
  isOpen: boolean;
  url: string;
  siteName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ModalManager {
  openModal: (type: import("./scene.types").ModalType) => void;
  closeModal: () => void;
  isModalOpen: (type: import("./scene.types").ModalType) => boolean;
  currentModal: import("./scene.types").ModalType | null;
}

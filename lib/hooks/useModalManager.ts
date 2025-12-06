/* Manages modal state across the application */
import { useCallback, useState } from "react";
import { ModalType } from "../types/scene.types";

export function useModalManager() {
  const [openModal, setOpenModal] = useState<ModalType | null>(null);

  const openModalByType = useCallback((type: ModalType) => {
    setOpenModal(type);
  }, []);

  const closeModal = useCallback(() => {
    setOpenModal(null);
  }, []);

  const isModalOpen = useCallback(
    (type: ModalType) => {
      return openModal === type;
    },
    [openModal]
  );

  return {
    openModal: openModalByType,
    closeModal,
    isModalOpen,
    currentModal: openModal,
  };
}

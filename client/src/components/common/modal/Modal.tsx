import { useEffect } from "react";
import type { ModalProps } from "../../../types/ui";
import Button from "../button/Button";
import "./Modal.css";

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="ghost"
          className="modal-close"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

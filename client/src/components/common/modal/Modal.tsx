import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./Modal.css";

interface ModalProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  closeTo?: string;
}

const Modal = ({ title, subtitle, children, closeTo = "/" }: ModalProps) => {
  return (
    <div className="modal-backdrop">
      <section className="modal-panel" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p className="modal-subtitle">{subtitle}</p> : null}
          </div>
          <Link to={closeTo} className="modal-close" aria-label="Close modal">
            Close
          </Link>
        </div>
        <div className="modal-content">{children}</div>
      </section>
    </div>
  );
};

export default Modal;

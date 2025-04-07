/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdClose } from "react-icons/md";
import { useRippleOutlineStyle } from "@/hooks/use-ripple-outline-style";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const rippleOutlineStyle = useRippleOutlineStyle();

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) {
      onClose?.();
    }
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] mx-auto flex min-w-[340px] items-center justify-center bg-neutral--2 bg-opacity-50 py-2"
          onClick={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <motion.div
            className="relative mx-4 max-h-[calc(100vh-32px)] w-full min-w-[320px] overflow-auto rounded-lg bg-white p-4 shadow-gray sm:w-fit sm:min-w-[500px]"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ duration: 0.1 }}
          >
            <div className="absolute right-3 top-3">
              <button
                className="rounded-sm stroke-neutral--1 p-1 transition-all duration-100 hover:bg-neutral--9"
                css={css`
                  ${rippleOutlineStyle.styles}
                `}
                onClick={() => {
                  onClose?.();
                }}
              >
                <MdClose size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

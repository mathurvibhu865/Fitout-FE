import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  type?: "spinner" | "dots";
  content: React.ReactNode;
  showFooter?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  width?: string;
  contentHeight?: string;
  showDivider?: boolean;
  hideCloseIcon?: boolean;
  hideConfirmButton?: boolean; // 👈 NEW PROP
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  content,
  showFooter = true,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  confirmButtonClassName = "bg-blue-600 text-white hover:bg-blue-700",
  cancelButtonClassName = "text-gray-700 border border-gray-300 hover:bg-gray-100",
  width = "max-w-lg",
  contentHeight = "",
  showDivider = true,
  hideCloseIcon = false,
  hideConfirmButton = false, // 👈 default to false
}) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    if (onCancel) onCancel();
    else onClose();
  };

  const contentClasses = `p-6 text-black ${
    contentHeight ? `${contentHeight} overflow-y-auto` : ""
  }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleCancel}
      data-testid="modal-backdrop"
    >
      <div className="fixed inset-0 bg-white/10 backdrop-blur-sm"></div>

      <div
        className={`bg-white rounded-md shadow-lg w-full relative z-50 ${width}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div
          className={`flex items-center ${title ? "px-6 py-4" : "px-4 pt-1"} ${
            title && showDivider ? "border-b" : ""
          }`}
          style={
            title && showDivider
              ? { borderBottomColor: "#E4E4E4", borderBottomWidth: "1px", borderStyle: "solid" }
              : undefined
          }
        >
          <div className="w-6" />

          <h2
            className="flex-grow text-[#5E5E5E] text-center font-normal text-xl"
            id="modal-title"
          >
            {title}
          </h2>

          {!hideCloseIcon && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="text-[#5E5E5E] text-2xl w-6 text-right"
            >
              &#x2715;
            </button>
          )}
        </div>

        {/* Body */}
        <div className={contentClasses}>{content}</div>

        {/* Footer */}
        {showFooter && (
          <div className="px-6 py-4 rounded-b-md">
            <div className="flex justify-center gap-3">
              {onCancel && (
                <button
                  onClick={handleCancel}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${cancelButtonClassName} cursor-pointer transition-colors`}
                >
                  {cancelText}
                </button>
              )}
              {!hideConfirmButton && (
                <button
                  onClick={onConfirm}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${confirmButtonClassName} cursor-pointer transition-colors`}
                >
                  {confirmText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
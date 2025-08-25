import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    footer,
    size = 'md',
    closeOnOutsideClick = true,
    showCloseButton = true,
}) => {
    const modalRef = useRef(null);

    // Handle Escape key press
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
            document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
            document.body.style.overflow = ''; // Restore scrolling when modal is closed
        };
    }, [isOpen, onClose]);

    // Handle outside click
    const handleOutsideClick = (e) => {
        if (
            closeOnOutsideClick &&
            modalRef.current &&
            !modalRef.current.contains(e.target)
        ) {
            onClose();
        }
    };

    // Determine modal width based on size
    const getModalWidth = () => {
        switch (size) {
            case 'sm':
                return 'max-w-md';
            case 'lg':
                return 'max-w-2xl';
            case 'xl':
                return 'max-w-4xl';
            case 'full':
                return 'max-w-full mx-4';
            default:
                return 'max-w-lg'; // Default 'md' size
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center"
                onClick={handleOutsideClick}
            >
                {/* Background overlay */}
                <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />

                {/* Modal panel */}
                <div
                    ref={modalRef}
                    className={`${getModalWidth()} w-full transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all`}
                >
                    {/* Header */}
                    {title && (
                        <div className="px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                                        aria-label="Close"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Body */}
                    <div className="px-6 py-4">{children}</div>

                    {/* Footer */}
                    {footer && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.node,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
    closeOnOutsideClick: PropTypes.bool,
    showCloseButton: PropTypes.bool,
};

export default Modal;

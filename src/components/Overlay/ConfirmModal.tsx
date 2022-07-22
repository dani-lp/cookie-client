import { Dialog } from '@headlessui/react';
import { ExclamationIcon } from '@heroicons/react/outline';

import { Modal } from './Modal';


interface ConfirmModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title?: string;
  content?: string;
  acceptText?: string;
  cancelText?: string;
  acceptCallback?: () => void;
  cancelCallback?: () => void;
  // cancelButtonRef: React.MutableRefObject<HTMLButtonElement | null>;
}

export const ConfirmModal = ({
  open,
  setOpen,
  title,
  content,
  acceptText = 'Accept',
  cancelText = 'Cancel',
  acceptCallback,
  cancelCallback,
  // cancelButtonRef,
}: ConfirmModalProps) => {
  const handleAccept = () => {
    if (acceptCallback) acceptCallback();
    setOpen(false);
  };

  const handleCancel = () => {
    if (cancelCallback) cancelCallback();
    setOpen(false);
  };

  return (
    <Modal open={open} setOpen={setOpen}>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <ExclamationIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            {title && (
              <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                {title}
              </Dialog.Title>
            )}
            {content && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  {content}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={handleAccept}
        >
          {acceptText}
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          onClick={handleCancel}
          // ref={cancelButtonRef}
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  );
};
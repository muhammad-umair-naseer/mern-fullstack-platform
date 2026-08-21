import * as Dialog from "@radix-ui/react-dialog";

export default function Modal({ triggerText, children }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500">
          {triggerText}
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay
          className="
            fixed inset-0 bg-black/40 backdrop-blur-sm
            data-[state=open]:animate-fadeIn data-[state=closed]:animate-fadeOut
          "
        />
        <Dialog.Content
          className="
            fixed left-1/2 top-1/2 w-[90%] max-w-lg -translate-x-1/2 -translate-y-1/2
            bg-white p-6 rounded-2xl shadow-lg outline-none
            data-[state=open]:animate-zoomIn data-[state=closed]:animate-zoomOut
          "
        >
          <Dialog.Title className="text-lg font-semibold mb-1">
            Modal Title
          </Dialog.Title>
          <Dialog.Description className="text-sm text-gray-500 mb-4">
            Use this space to describe the purpose of the dialog.
          </Dialog.Description>

          {children}

          <Dialog.Close
            className="
              absolute top-3 right-3 inline-flex items-center justify-center
              text-gray-600 hover:text-black rounded-md
              focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500
            "
            aria-label="Close"
          >
            ✕
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

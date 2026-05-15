import { Toaster } from "sonner";

function ToastComponent() {
  return (
    <>
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand
        visibleToasts={4}
        duration={4000}
        toastOptions={{
          style: {
            borderRadius: "14px",
            fontSize: "14px",
          },
        }}
      />
    </>
  );
}

export default ToastComponent;

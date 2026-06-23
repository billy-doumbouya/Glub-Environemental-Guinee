import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { router } from "./routes";
import { ErrorBoundary } from "./fallback/ErrorBoundary";
import { LoadingFallback } from "./fallback/LoadingFallback";
import { Toaster } from "sonner";
import "nprogress/nprogress.css";
import { AuthProvider } from "./hooks/useAuth";
import ToastComponent from "./components/ui/Mytoaster";
import { useGlobalChunkErrorHandler } from "./fallback/useGlobalChunkErrorHandler";

export default function App() {
  useGlobalChunkErrorHandler(); 
  return (
    <>
      {/* Gère les erreurs de chargement de chunk */}
      <ErrorBoundary>
        <AuthProvider>
          {" "}
          {/* ← remonté au-dessus de Suspense */}
          <Toaster
            position="top-right"
            richColors
            duration={3000}
            toastOptions={{
              style: { fontFamily: "Inter, sans-serif", fontSize: "14px" },
            }}
          />
          <ToastComponent />
          <HelmetProvider>
            <Suspense fallback={<LoadingFallback />}>
              <RouterProvider router={router} />
            </Suspense>
          </HelmetProvider>
        </AuthProvider>
      </ErrorBoundary>
    </>
  );
}

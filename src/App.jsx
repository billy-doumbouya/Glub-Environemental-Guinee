import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { router } from './routes'
import { ErrorBoundary } from './fallback/ErrorBoundary'
import { LoadingFallback } from './fallback/LoadingFallback'

export default function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </HelmetProvider>
  )
}

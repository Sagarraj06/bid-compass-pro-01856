import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CreditProvider } from '@/contexts/CreditContext';
import { Loader2 } from 'lucide-react';

const Dashboard = lazy(() => import('./pages/Index'));
const CompanySearch = lazy(() => import('./pages/CompanySearch'));
const ReportGeneration = lazy(() => import('./pages/ReportGeneration'));
const ReportHistory = lazy(() => import('./pages/ReportHistory'));
const Login = lazy(() => import('./pages/Login'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = sessionStorage.getItem('token');
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CreditProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/search"
                element={
                  <ProtectedRoute>
                    <CompanySearch />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/generate"
                element={
                  <ProtectedRoute>
                    <ReportGeneration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <ReportHistory />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </CreditProvider>
  </QueryClientProvider>
);

export default App;

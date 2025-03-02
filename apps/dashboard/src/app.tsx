import type React from "react";
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import EmptyLayout from "./layouts/EmptyLayout";
import { logEvent } from "./utils/logger";

// Lazy-loaded pages
const DashboardPage = lazy(() => import("./pages/index"));
const BookingsPage = lazy(() => import("./pages/bookings"));
const PaymentsPage = lazy(() => import("./pages/payments"));
const ReportsPage = lazy(() => import("./pages/reports"));
const SettingsPage = lazy(() => import("./pages/settings"));
const SignupPage = lazy(() => import("./pages/signup"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
      cacheTime: 1000 * 60 * 10, // Keep unused cache data for 10 minutes
      refetchOnWindowFocus: false, // Prevent unnecessary refetching
    },
  },
});

const App: React.FC = () => {
  const { isAuthenticated, userRole } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Toaster position="top-right" />
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen text-xl">
                Loading...
              </div>
            }
          >
            <Routes>
              {/* Authenticated routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute
                    isAllowed={isAuthenticated}
                    redirectTo="/signup"
                  >
                    <AdminLayout>
                      <DashboardPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute
                    isAllowed={isAuthenticated}
                    redirectTo="/signup"
                  >
                    <AdminLayout>
                      <BookingsPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute
                    isAllowed={isAuthenticated}
                    redirectTo="/signup"
                  >
                    <AdminLayout>
                      <PaymentsPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute
                    isAllowed={isAuthenticated && userRole === "ADMIN"}
                    redirectTo="/"
                  >
                    <AdminLayout>
                      <ReportsPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute
                    isAllowed={isAuthenticated}
                    redirectTo="/signup"
                  >
                    <AdminLayout>
                      <SettingsPage />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />

              {/* Public route */}
              <Route
                path="/signup"
                element={
                  <EmptyLayout>
                    <SignupPage />
                  </EmptyLayout>
                }
              />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </QueryClientProvider>
  );
};

export default App;

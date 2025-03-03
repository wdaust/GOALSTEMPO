import { Suspense, useEffect, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import HabitsPage from "./pages/HabitsPage";
import GoalsPage from "./pages/GoalsPage";
import AccountabilityPage from "./pages/AccountabilityPage";
import JournalPage from "./pages/JournalPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import AuthPage from "./pages/AuthPage";
import EmailVerifiedPage from "./pages/EmailVerifiedPage";
import BibleReadingPage from "./pages/BibleReadingPage";
import LandingPage from "./components/LandingPage";
import { getCurrentUser } from "./lib/auth";
import routes from "tempo-routes";
import { supabase } from "./lib/supabase";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // First useEffect for auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Second useEffect for auth listener
  useEffect(() => {
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN") {
          setUser(session?.user || null);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-3">Loading app...</span>
        </div>
      }
    >
      <>
        {/* For Tempo routes */}
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

        <Routes>
          <Route path="/auth" element={<Navigate to="/app/auth" replace />} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />
          <Route
            path="/app"
            element={user ? <Dashboard /> : <Navigate to="/app/auth" replace />}
          />
          <Route
            path="/habits"
            element={user ? <HabitsPage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/goals"
            element={user ? <GoalsPage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/accountability"
            element={
              user ? <AccountabilityPage /> : <Navigate to="/auth" replace />
            }
          />
          <Route
            path="/journal"
            element={user ? <JournalPage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/profile"
            element={user ? <ProfilePage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/settings"
            element={user ? <SettingsPage /> : <Navigate to="/auth" replace />}
          />
          <Route
            path="/bible-reading"
            element={
              user ? <BibleReadingPage /> : <Navigate to="/auth" replace />
            }
          />
          {/* Removed duplicate /app route */}
          <Route path="/app/auth" element={<AuthPage />} />
          <Route
            path="/app/*"
            element={
              user ? (
                <Navigate to="/app" replace />
              ) : (
                <Navigate to="/app/auth" replace />
              )
            }
          />

          {/* Redirect root to app */}
          <Route path="/" element={<Navigate to="/app" replace />} />

          {/* For all other paths, don't render the React app */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </>
    </Suspense>
  );
}

export default App;

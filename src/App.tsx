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
import { getCurrentUser } from "./lib/auth";
import routes from "tempo-routes";
import { supabase } from "./lib/supabase";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/email-verified" element={<EmailVerifiedPage />} />
          <Route
            path="/"
            element={user ? <Dashboard /> : <Navigate to="/auth" replace />}
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;

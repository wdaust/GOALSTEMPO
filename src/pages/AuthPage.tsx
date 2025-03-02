import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { getCurrentUser } from "@/lib/auth";

type AuthMode = "login" | "register";

const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Error checking authentication:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
  };

  const handleAuthSuccess = () => {
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        {mode === "login" ? (
          <LoginForm
            onSuccess={handleAuthSuccess}
            onRegisterClick={toggleMode}
          />
        ) : (
          <RegisterForm
            onSuccess={handleAuthSuccess}
            onLoginClick={toggleMode}
          />
        )}
      </div>
      <div className="hidden lg:block lg:w-1/2 bg-blue-600">
        <div className="h-full flex flex-col justify-center items-center p-12 text-white">
          <h1 className="text-4xl font-bold mb-6">KHGoals</h1>
          <p className="text-xl mb-8 text-center">
            Track your spiritual habits, set meaningful goals, and grow in faith
          </p>
          <div className="space-y-4 max-w-md">
            <div className="bg-blue-500 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Track Spiritual Habits</h3>
              <p className="text-sm opacity-90">
                Monitor your Bible reading, meeting attendance, and field
                service with visual progress indicators.
              </p>
            </div>
            <div className="bg-blue-500 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Set Meaningful Goals</h3>
              <p className="text-sm opacity-90">
                Create goals for pioneering, language learning, and scripture
                memorization with step-by-step tracking.
              </p>
            </div>
            <div className="bg-blue-500 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Stay Accountable</h3>
              <p className="text-sm opacity-90">
                Connect with accountability partners to encourage each other in
                your spiritual journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

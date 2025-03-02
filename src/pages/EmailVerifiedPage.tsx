import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmailVerifiedPage = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/auth");
    }, 5000);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdownInterval);
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Email Verified!</h1>
        <p className="text-muted-foreground mb-6">
          Your email has been successfully verified. You can now sign in to your
          account.
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Redirecting to login in {countdown} seconds...
        </p>
        <Button onClick={() => navigate("/auth")} className="w-full">
          Go to Login
        </Button>
      </div>
    </div>
  );
};

export default EmailVerifiedPage;

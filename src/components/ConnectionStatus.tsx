import React, { useState, useEffect } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { checkSupabaseConnection } from "@/lib/supabase";

interface ConnectionStatusProps {
  onRetry?: () => void;
}

const ConnectionStatus = ({ onRetry }: ConnectionStatusProps) => {
  const [status, setStatus] = useState<"checking" | "connected" | "error">(
    "checking",
  );
  const [message, setMessage] = useState<string>("");

  const checkConnection = async () => {
    setStatus("checking");
    try {
      const result = await checkSupabaseConnection();
      if (result.connected) {
        setStatus("connected");
        setMessage(result.message);
      } else {
        setStatus("error");
        setMessage(result.message || "Failed to connect to database");
      }
    } catch (error) {
      setStatus("error");
      setMessage("An unexpected error occurred while checking the connection");
      console.error("Connection check error:", error);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const handleRetry = () => {
    checkConnection();
    if (onRetry) onRetry();
  };

  if (status === "checking") {
    return (
      <Alert className="bg-blue-50 border-blue-200 mb-4">
        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        <AlertTitle>Checking database connection</AlertTitle>
        <AlertDescription>
          Please wait while we verify the connection...
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "error") {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Connection Error</AlertTitle>
        <AlertDescription className="flex flex-col space-y-2">
          <p>{message}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRetry}
            className="self-start mt-2 flex items-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Retry Connection
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (status === "connected") {
    return (
      <Alert className="bg-green-50 border-green-200 mb-4">
        <CheckCircle className="h-4 w-4 text-green-500" />
        <AlertTitle>Connected</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default ConnectionStatus;

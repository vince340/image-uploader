import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import ImageUploader from "./pages/ImageUploader";
import AIAvatar from "./components/AIAvatar";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={ImageUploader} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [showAvatar, setShowAvatar] = useState(false);
  
  // Check if OpenAI API key is available
  useEffect(() => {
    const checkApiKey = async () => {
      try {
        const hasKey = await fetch('/api/ai/welcome')
          .then(res => res.ok);
        setShowAvatar(hasKey);
      } catch (error) {
        console.error('Failed to check AI availability:', error);
        setShowAvatar(false);
      }
    };
    
    checkApiKey();
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      {showAvatar && <AIAvatar />}
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

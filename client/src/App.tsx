import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import FontLoader from "@/lib/fontLoader";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <FontLoader />
          <Toaster />
          <Router />
        </TooltipProvider>
      </NextThemesProvider>
    </QueryClientProvider>
  );
}

export default App;

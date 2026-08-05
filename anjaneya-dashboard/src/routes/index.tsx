import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Anjaneya — AI Event Operations Dashboard" },
      {
        name: "description",
        content:
          "Plan, staff and analyse national-scale hackathons and summits with AI-matched volunteers, live registration analytics and one-click content generation.",
      },
      { property: "og:title", content: "Anjaneya — AI Event Operations Dashboard" },
      {
        property: "og:description",
        content:
          "A premium AI control room for event organisers: volunteer matching, analytics and automated content in one workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
  ssr: false,
});

function AppShell() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {isAuthenticated ? (
        <DashboardPage key="dashboard" onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <LoginPage key="login" onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </AnimatePresence>
  );
}

function Index() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}

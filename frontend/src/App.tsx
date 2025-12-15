import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { ThemeProvider } from "next-themes";

import { queryClient } from "./lib/queryClient";
import { wagmiConfig } from "./lib/wagmi";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/layout/AdminLayout";

/* =======================
   PAGES
======================= */
import LandingPage from "@/pages/landing";
import DashboardHome from "@/pages/dashboard-home";
import RegisterContent from "@/pages/register-content";
import MyContents from "@/pages/my-contents";
import VerifyContent from "@/pages/verify-content";
import Activity from "@/pages/activity";
import RegisterPublisher from "@/pages/register-publisher";
import ManagePublishers from "@/pages/admin";
import ContentReview from "@/pages/admin/content-review";
import NotFound from "@/pages/not-found";

/* =======================
   ROUTER
======================= */
function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={LandingPage} />
      <Route path="/verify" component={VerifyContent} />
      <Route path="/activity" component={Activity} />
      <Route path="/register-publisher" component={RegisterPublisher} />

      {/* Publisher */}
      <Route path="/dashboard">
        {() => (
          <ProtectedRoute requirePublisher>
            <Layout>
              <DashboardHome />
            </Layout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/dashboard/upload">
        {() => (
          <ProtectedRoute requirePublisher>
            <Layout>
              <RegisterContent />
            </Layout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/dashboard/contents">
        {() => (
          <ProtectedRoute requirePublisher>
            <Layout>
              <MyContents />
            </Layout>
          </ProtectedRoute>
        )}
      </Route>

      {/* Admin */}
      <Route path="/admin/publishers">
        {() => (
          <ProtectedRoute requireOwner>
            <AdminLayout>
              <ManagePublishers />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>

      <Route path="/admin/review">
        {() => (
          <ProtectedRoute requireOwner>
            <AdminLayout>
              <ContentReview />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

/* =======================
   APP
======================= */
function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

export default App;

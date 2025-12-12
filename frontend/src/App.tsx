import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./lib/wagmi";
import { ThemeProvider } from "next-themes";
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
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import { AdminLayout } from "@/components/layout/AdminLayout";

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />

      {/* Protected Publisher Routes */}
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
      {/* API Usage route - Hidden */}
      {/* <Route path="/dashboard/api">
        {() => (
          <ProtectedRoute requirePublisher>
            <Layout>
              <APIUsage />
            </Layout>
          </ProtectedRoute>
        )}
      </Route> */}

      {/* Public Routes */}
      <Route path="/verify" component={VerifyContent} />
      <Route path="/activity" component={Activity} />
      <Route path="/register-publisher" component={RegisterPublisher} />

      {/* API Docs routes - Hidden */}
      {/* <Route path="/docs" component={APIDocs} /> */}
      {/* <Route path="/docs/introduction" component={APIDocs} /> */}
      {/* <Route path="/docs/register" component={APIDocs} /> */}
      {/* <Route path="/docs/verify" component={APIDocs} /> */}
      {/* <Route path="/docs/contents" component={APIDocs} /> */}
      {/* <Route path="/docs/notes" component={APIDocs} /> */}

      {/* Protected Admin Routes */}
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
      {/* System Monitor route - Hidden */}
      {/* <Route path="/admin/monitor">
        {() => (
          <ProtectedRoute requireOwner>
            <AdminLayout>
              <SystemMonitor />
            </AdminLayout>
          </ProtectedRoute>
        )}
      </Route> */}

      <Route component={NotFound} />
    </Switch>
  );
}

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

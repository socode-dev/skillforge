import { Route, Routes } from "react-router-dom";
import LandingPageLayout from "@/layouts/LandingPageLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import LandingPage from "@/pages/landing/LandingPage";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import { SidebarProvider } from "@/context/useSidebarContext";
import PublicRoute from "@/routes/PublicRoute";
import { ChatProvider } from "@/context/useChatContext";
import { lazy } from "react";
import LazyWrapper from "./LazyWrapper";

const Login = lazy(() => import("@/pages/auth/Login"));
const Signup = lazy(() => import("@/pages/auth/Signup"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Discover = lazy(() => import("@/pages/discover/Discover"));
const SkillRequests = lazy(() => import ("@/pages/skillRequests/SkillRequests"));
const ChatList = lazy(() => import("@/pages/messages/ChatList"));
const ChatThread = lazy(() => import("@/pages/messages/ChatThread"));
const Profile = lazy(() => import("@/pages/profile/Profile"));
const Settings = lazy(() => import("@/pages/settings/Settings"));

const LoadingFallback =  <main className="bg-background h-full w-full flex justify-center items-center">
    <p className="text-2xl text-muted-foreground">Loading...</p>
  </main>

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LandingPageLayout />
          </PublicRoute>
        }
      >
        <Route index element={<LandingPage />} />
        <Route path="login" element={
          <LazyWrapper loadingFallback={LoadingFallback}>
            <Login />
          </LazyWrapper>} />
        <Route path="signup/:slug" element={
          <LazyWrapper loadingFallback={LoadingFallback}>
            <Signup />
          </LazyWrapper>} />
      </Route>

      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <SidebarProvider>
              <DashboardLayout />
            </SidebarProvider>
          </ProtectedRoute>
        }
      >
        <Route index element={
          <LazyWrapper loadingFallback={LoadingFallback}>
            <Dashboard />
          </LazyWrapper>} />
        <Route path="discover" element={
          <LazyWrapper loadingFallback={LoadingFallback} > 
            <Discover /> 
          </LazyWrapper>} />
        <Route path="skill-requests" element={
          <LazyWrapper loadingFallback={LoadingFallback}>
            <SkillRequests />
          </LazyWrapper>} />
        <Route path="messages" element={
          <ChatProvider>
            <LazyWrapper loadingFallback={LoadingFallback}>
              <ChatList />
            </LazyWrapper>
          </ChatProvider>} />
        <Route path="messages/thread/:slug" element={
          <ChatProvider>
            <LazyWrapper loadingFallback={LoadingFallback}>
              <ChatThread />
            </LazyWrapper>
          </ChatProvider>} />
        <Route path="profile" element={
          <LazyWrapper loadingFallback={LoadingFallback}>
            <Profile />
          </LazyWrapper>} />
        <Route path="settings" element={
          <LazyWrapper loadingFallback={LoadingFallback}>
            <Settings />
          </LazyWrapper>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

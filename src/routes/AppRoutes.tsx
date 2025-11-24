import { Route, Routes } from "react-router-dom";
import LandingPageLayout from "../Layouts/LandingPageLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import LandingPage from "../pages/landing/LandingPage";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/dashboard/Dashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import { SidebarProvider } from "../context/useSidebarContext";
import Discover from "../pages/discover/Discover";
import SkillRequests from "../pages/skillRequests/SkillRequests";
import Messages from "../pages/messages/Messages";
import Profile from "../pages/profile/Profile";
import Settings from "../pages/settings/Settings";
import PublicRoute from "./PublicRoute";

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
        <Route path="login" element={<Login />} />
        <Route path="signup/:slug" element={<Signup />} />
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
        <Route index element={<Dashboard />} />
        <Route path="discover" element={<Discover />} />
        <Route path="skill-requests" element={<SkillRequests />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;

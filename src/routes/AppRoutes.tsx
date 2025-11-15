import { Route, Routes } from "react-router-dom";
import LandingPageLayout from "../Layouts/LandingPageLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import LandingPage from "../pages/Landing/LandingPage";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Dashboard from "../pages/Dashboard/Dashboard";
import { ProtectedRoute } from "./ProtectedRoute";
import { SidebarProvider } from "../context/useSidebarContext";
import Discover from "../pages/Dashboard/Discover";
import SkillRequests from "../pages/Dashboard/SkillRequests";
import Messages from "../pages/Dashboard/Messages";
import Profile from "../pages/Dashboard/Profile";
import Settings from "../pages/Dashboard/Settings";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPageLayout />}>
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

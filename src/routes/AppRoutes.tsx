import { Route, Routes } from "react-router-dom";
import LandingPageLayout from "../Layouts/LandingPageLayout";
import DashboardLayout from "../Layouts/DashboardLayout";
import LandingPage from "../pages/Landing/LandingPage";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPageLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      <Route element={<DashboardLayout />}></Route>
    </Routes>
  );
};

export default AppRoutes;

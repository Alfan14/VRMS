import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ToastProvider from "./components/common/ToastProvider";
import Home from "./pages/Dashboard/Home";
import UsersPage from "./pages/Users/Users";
import { getUserRole, ADMIN_ROLES, type UserRole } from "./lib/auth";
import { toast } from "./lib/toast";
import VehiclesPage from "./pages/Vehicles/Vehicles";
import KantorPage from "./pages/Kantor/Kantor";
import WilayahPage from "./pages/Wilayah/Wilayah";
import NotFound from "./pages/OtherPage/NotFound";
import ReservationsPage from "./pages/Reservations/Reservations";
import VehicleUsagePage from "./pages/VehicleUsage/VehicleUsage";
import FuelPage from "./pages/Fuels/Fuel";
import ServicesPage from "./pages/Services/Services";
import ApprovalLevel1Page from "./pages/Approvals/ApprovalLevel1";
import ApprovalLevel2Page from "./pages/Approvals/ApprovalLevel2";
import DriversPage from "./pages/Drivers/Drivers";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

const GuestRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : <Outlet />;
};

const RoleRoute = ({ allowedRoles }: { allowedRoles: UserRole[] }) => {
  const role = getUserRole();
  const isAllowed = role !== null && allowedRoles.includes(role);

  useEffect(() => {
    if (!isAllowed) {
      toast.warning(
        "Akses Ditolak",
        "Anda tidak memiliki izin untuk mengakses halaman ini.",
      );
    }
  }, [isAllowed]);

  return isAllowed ? <Outlet /> : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <Router>
      <ToastProvider />
      <ScrollToTop />
      <Routes>
        {/* Protected: all app pages require a valid token */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            {/* All authenticated roles */}
            <Route index path="/" element={<Home />} />
            <Route path="/profile" element={<UserProfiles />} />

            {/* Admin / superadmin / manager only */}
            <Route element={<RoleRoute allowedRoles={ADMIN_ROLES} />}>
              <Route path="/users" element={<UsersPage />} />
              <Route path="/vehicles" element={<VehiclesPage />} />
              <Route path="/drivers" element={<DriversPage />} />
              <Route path="/reservations" element={<ReservationsPage />} />
              <Route path="/master/offices" element={<KantorPage />} />
              <Route path="/master/regions" element={<WilayahPage />} />
              <Route path="/vehicle-usages" element={<VehicleUsagePage />} />
              <Route path="/fuel-records" element={<FuelPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/approvals/level-1" element={<ApprovalLevel1Page />} />
              <Route path="/approvals/level-2" element={<ApprovalLevel2Page />} />
            </Route>
          </Route>
        </Route>

        {/* Guest only: redirect to dashboard if already authenticated */}
        <Route element={<GuestRoute />}>
          <Route path="/signin" element={<SignIn />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

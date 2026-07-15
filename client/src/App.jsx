import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./modules/common/Home";
import Login from "./modules/common/Login";
import Register from "./modules/common/Register";
import ForgotPassword from "./modules/common/ForgotPassword";
import SavedProperties from "./modules/common/SavedProperties";

import PropertyDetails from "./modules/user/PropertyDetails";

import RenterHome from "./modules/user/renter/RenterHome";
import RenterAllProperties from "./modules/user/renter/AllProperties";

import OwnerHome from "./modules/user/owner/OwnerHome";
import AddProperty from "./modules/user/owner/AddProperty";
import OwnerAllProperties from "./modules/user/owner/AllProperties";
import OwnerAllBookings from "./modules/user/owner/AllBookings";

import AdminHome from "./modules/admin/AdminHome";
import AdminAllUsers from "./modules/admin/AllUsers";
import AdminAllProperty from "./modules/admin/AllProperty";
import AdminAllBookings from "./modules/admin/AllBookings";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/properties/:id" element={<PropertyDetails />} />
        <Route path="/saved" element={<SavedProperties />} />
        {/* Public browsing - anyone (guest, renter, owner, admin) can search/browse listings */}
        <Route path="/renter/properties" element={<RenterAllProperties />} />

        {/* Renter */}
        <Route path="/renter" element={<ProtectedRoute allowedRoles={["user"]}><RenterHome /></ProtectedRoute>} />

        {/* Owner */}
        <Route path="/owner" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerHome /></ProtectedRoute>} />
        <Route path="/owner/properties" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerAllProperties /></ProtectedRoute>} />
        <Route path="/owner/properties/new" element={<ProtectedRoute allowedRoles={["owner"]}><AddProperty /></ProtectedRoute>} />
        <Route path="/owner/properties/:id/edit" element={<ProtectedRoute allowedRoles={["owner"]}><AddProperty /></ProtectedRoute>} />
        <Route path="/owner/bookings" element={<ProtectedRoute allowedRoles={["owner"]}><OwnerAllBookings /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminHome /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAllUsers /></ProtectedRoute>} />
        <Route path="/admin/properties" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAllProperty /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute allowedRoles={["admin"]}><AdminAllBookings /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;

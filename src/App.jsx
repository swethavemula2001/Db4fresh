// import { useLocation } from "react-router-dom";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import BottomNav from "./components/BottomNav";
// import FloatingCart from "./components/FloatingCart";
// import AddressModal from "./components/AddressModal";

// import AppRoutes from "./routes/AppRoutes";
// import AdminRoutes from "./Admin/Routes/AdminRoutes";

// export default function App() {
//   const location = useLocation();
//   const isAdminRoute = location.pathname.startsWith("/admin");

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       {/* USER HEADER */}
//       {!isAdminRoute && <Header />}

//       {/* MAIN CONTENT */}
//       <main className={`flex-1 ${isAdminRoute ? "" : "px-2 md:px-6 py-4"}`}>
//         {/* IMPORTANT: render ONLY ONE */}
//         {isAdminRoute ? <AdminRoutes /> : <AppRoutes />}
//       </main>

//       {/* USER FOOTER & NAV */}
//       {!isAdminRoute && <Footer />}
//       {!isAdminRoute && <BottomNav />}
//       {!isAdminRoute && <FloatingCart />}
//       {!isAdminRoute && <AddressModal />}
//     </div>
//   );
// }
import Header from "./components/Header";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import FloatingCart from "./components/FloatingCart";
import AppRoutes from "./routes/AppRoutes";
import AddressModal from "./components/AddressModal";



export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <Header />

      {/* MAIN CONTENT */}
      <main className="flex-1 px-2 md:px-6 py-4">
        <AppRoutes />
      </main>
      <Footer />
      <BottomNav />
      <FloatingCart />
      <AddressModal />
    </div>
  );
}

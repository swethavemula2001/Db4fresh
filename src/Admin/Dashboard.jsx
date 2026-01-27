// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     products: 0,
//     orders: 0,
//     users: 0,
//     revenue: 0,
//   });

//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//   const token = localStorage.getItem("adminToken");

//   fetch("http://localhost:4000/api/admin/stats", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   })
//     .then((res) => {
//       if (!res.ok) throw new Error("Stats API failed");
//       return res.json();
//     })
//     .then((data) => {
//       setStats({
//         products: data.products || 0,
//         orders: data.orders || 0,
//         users: data.users || 0,
//         revenue: data.revenue || 0,
//       });
//       setLoading(false);
//     })
//     .catch((err) => {
//       console.error("Dashboard stats error:", err);
//       setLoading(false);
//     });
// }, []);


//   if (loading) {
//     return <p>Loading dashboard...</p>;
//   }

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

//         {/* PRODUCTS */}
//         <DashboardCard
//           title="Products"
//           value={stats.products}
//           onClick={() => navigate("/admin/products")}
//         />

//         {/* ORDERS */}
//         <DashboardCard
//           title="Orders"
//           value={stats.orders}
//           onClick={() => navigate("/admin/orders")}
//         />

//         {/* USERS */}
//         <DashboardCard
//           title="Users"
//           value={stats.users}
//           onClick={() => navigate("/admin/users")}
//         />

//         {/* ✅ REVENUE (CLICKABLE NOW) */}
//         <DashboardCard
//           title="Revenue"
//           value={`₹${stats.revenue}`}
//           onClick={() => navigate("/admin/revenue")}
//           valueClass="text-green-600"
//         />

//       </div>
//     </div>
//   );
// }

// /* =========================
//    CARD COMPONENT
// ========================= */
// function DashboardCard({ title, value, onClick, valueClass = "" }) {
//   return (
//     <div
//       onClick={onClick}
//       className="p-5 bg-white shadow rounded cursor-pointer
//                  hover:shadow-lg hover:scale-[1.02] transition"
//     >
//       <p className="text-gray-500">{title}</p>
//       <p className={`text-xl font-bold ${valueClass}`}>{value}</p>
//     </div>
//   );
// }




import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD DASHBOARD STATS
  ========================= */
  useEffect(() => {
    console.log("✅ Dashboard component mounted");

    const token = localStorage.getItem("adminToken");

    const loadStats = async () => {
      try {
        const res = await fetch(
          "http://localhost:4000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Stats API failed");
        }

        const data = await res.json();
        console.log("📊 Dashboard API Data:", data);

        setStats({
          products: Number(data.products) || 0,
          orders: Number(data.orders) || 0,
          users: Number(data.users) || 0,
          revenue: Number(data.revenue) || 0,
        });
      } catch (err) {
        console.error("❌ Dashboard stats error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  /* =========================
     LOADING STATE
  ========================= */
  if (loading) {
    return (
      <div className="p-6 text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Dashboard Overview
      </h2>

      {/* DEBUG (REMOVE LATER) */}
      <p className="text-xs text-gray-400 mb-4">
        Products: {stats.products} | Orders: {stats.orders} | Users:{" "}
        {stats.users} | Revenue: ₹{stats.revenue}
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        <DashboardCard
          title="Products"
          value={stats.products}
          onClick={() => navigate("/admin/products")}
        />

        <DashboardCard
          title="Orders"
          value={stats.orders}
          onClick={() => navigate("/admin/orders")}
        />

        <DashboardCard
          title="Users"
          value={stats.users}
          onClick={() => navigate("/admin/users")}
        />

        <DashboardCard
          title="Revenue"
          value={`₹${stats.revenue}`}
          valueClass="text-green-600"
          onClick={() => navigate("/admin/revenue")}
        />

      </div>
    </div>
  );
}

/* =========================
   CARD COMPONENT
========================= */
function DashboardCard({ title, value, onClick, valueClass = "" }) {
  return (
    <div
      onClick={onClick}
      className="p-5 bg-white shadow rounded cursor-pointer
                 hover:shadow-lg hover:scale-[1.02] transition"
    >
      <p className="text-gray-500">{title}</p>
      <p className={`text-xl font-bold ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

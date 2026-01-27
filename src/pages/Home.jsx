

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "../components/ProductCard";
// import { FaTruck, FaFire, FaTags } from "react-icons/fa";

// const COMING_SOON_CATEGORIES = [
//   "Beauty",
//   "Fashion",
//   "Gym Freaks",
//   "Pharmacy",
// ];

// export default function Home() {
//   const [categories, setCategories] = useState([]);
//   const [products, setProducts] = useState([]);

//   const [activeCategory, setActiveCategory] = useState("ALL");
//   const [activeSubcategory, setActiveSubcategory] = useState(null);
//   const [loading, setLoading] = useState(false);

//   /* ================= LOAD CATEGORIES ================= */
//   useEffect(() => {
//     axios
//       .get("http://localhost:4000/api/categories/with-subcategories")
//       .then((res) => {
//         if (Array.isArray(res.data)) setCategories(res.data);
//       })
//       .catch(console.error);
//   }, []);

//   /* ================= LOAD ALL PRODUCTS ================= */
//   const loadAllProducts = () => {
//     setLoading(true);
//     setActiveCategory("ALL");
//     setActiveSubcategory(null);

//     axios
//       .get("http://localhost:4000/api/products")
//       .then((res) => {
//         setProducts(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };

//   useEffect(() => {
//     loadAllProducts();
//   }, []);

//   /* ================= LOAD PRODUCTS BY SUBCATEGORY ================= */
//   const loadProductsBySubcategory = (subId) => {
//     setLoading(true);
//     setActiveSubcategory(subId);

//     axios
//       .get(`http://localhost:4000/api/products/subcategory/${subId}`)
//       .then((res) => {
//         setProducts(Array.isArray(res.data) ? res.data : []);
//       })
//       .catch(console.error)
//       .finally(() => setLoading(false));
//   };

//   /* ================= HELPERS ================= */
//   const activeCategoryObj =
//     categories.find((c) => c.id === activeCategory) || null;

//   const isComingSoon =
//     COMING_SOON_CATEGORIES.includes(activeCategoryObj?.name);

//   return (
//     <div className="bg-gray-100 min-h-screen pb-24">

//       {/* 🔴 HERO */}
//       <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-4 py-4 rounded-b-2xl">
//         <h1 className="text-xl font-bold">Delivery in 30 Minutes ⚡</h1>
//         <p className="text-xs opacity-90">Fresh groceries at your doorstep</p>
//       </div>

//       {/* 🔥 ADVERTISEMENT STRIP */}
//       <div className="bg-red-100 px-4 py-3">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          
//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
//             <FaTruck className="text-red-600 text-2xl" />
//             <div>
//               <p className="font-semibold text-sm">Free Delivery</p>
//               {/* <p className="text-xs text-gray-500">Orders above ₹199</p> */}
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
//             <FaFire className="text-red-600 text-2xl" />
//             <div>
//               <p className="font-semibold text-sm">Today’s Deals</p>
//               <p className="text-xs text-gray-500">Fresh offers daily</p>
//             </div>
//           </div>

//           <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
//             <FaTags className="text-red-600 text-2xl" />
//             <div>
//               <p className="font-semibold text-sm">Offer Zone</p>
//               <p className="text-xs text-gray-500">Save up to 40%</p>
//             </div>
//           </div>

//         </div>
//       </div>

//       {/* 🟢 CATEGORY SLIDER */}
//       <div className="flex gap-3 overflow-x-auto px-4 py-3 bg-white sticky top-0 z-10">

//         <button
//           onClick={loadAllProducts}
//           className={`px-4 py-2 rounded-full text-sm font-medium ${
//             activeCategory === "ALL"
//               ? "bg-red-600 text-white"
//               : "bg-gray-100 text-gray-700"
//           }`}
//         >
//           All
//         </button>

//         {categories.map((cat) => (
//           <button
//             key={cat.id}
//             onClick={() => {
//               setActiveCategory(cat.id);
//               setActiveSubcategory(null);

//               if (COMING_SOON_CATEGORIES.includes(cat.name)) {
//                 setProducts([]);
//                 return;
//               }

//               const firstSub = cat.subcategories?.[0];
//               if (firstSub) {
//                 loadProductsBySubcategory(firstSub.id);
//               }
//             }}
//             className={`px-4 py-2 rounded-full text-sm font-medium ${
//               activeCategory === cat.id
//                 ? "bg-red-600 text-white"
//                 : "bg-gray-100 text-gray-700"
//             }`}
//           >
//             {cat.name}
//           </button>
//         ))}
//       </div>

//       {/* 🟡 SUBCATEGORIES */}
//       {activeCategory !== "ALL" && !isComingSoon && (
//         <div className="flex gap-3 overflow-x-auto px-4 py-3">
//           {activeCategoryObj?.subcategories?.map((sub) => (
//             <button
//               key={sub.id}
//               onClick={() => loadProductsBySubcategory(sub.id)}
//               className={`min-w-[90px] p-2 rounded-xl bg-white shadow text-center ${
//                 activeSubcategory === sub.id
//                   ? "border-2 border-red-500"
//                   : ""
//               }`}
//             >
//               <img src={sub.image
//       ? `http://localhost:4000/uploads/subcategories/${sub.image}`
//       : "https://via.placeholder.com/80"
//   }
//   alt={sub.name}
//   className="w-14 h-14 mx-auto rounded-lg object-cover"
// />

//               <p className="text-xs mt-1 font-medium">{sub.name}</p>
//             </button>
//           ))}
//         </div>
//       )}

//       {/* 🛒 PRODUCTS / COMING SOON */}
//       <section className="mt-4 px-4">

//         {isComingSoon && (
//           <div className="w-full py-14 bg-red-100 border-2 border-red-600 rounded-xl text-center">
//             <h2 className="text-4xl font-extrabold text-red-600 tracking-widest">
//               🚧 COMING SOON 🚧
//             </h2>
//             <p className="text-red-500 mt-3 font-medium">
//               {activeCategoryObj?.name} category will be available shortly
//             </p>
//           </div>
//         )}

//         {!isComingSoon && (
//           <>
//             {loading && (
//               <p className="text-sm text-gray-500">Loading products...</p>
//             )}

//             {!loading && products.length === 0 && (
//               <p className="text-sm text-gray-500">
//                 No products available
//               </p>
//             )}

//             <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
//               {products.map((p) => (
//                 <ProductCard key={p.id} p={p} />
//               ))}
//             </div>
//           </>
//         )}
//       </section>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { FaTruck, FaFire, FaTags } from "react-icons/fa";

const API_BASE = "http://localhost:4000";

const COMING_SOON_CATEGORIES = [
  "Beauty",
  "Fashion",
  "Gym Freaks",
  "Pharmacy",
  "Electronics"
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/categories/with-subcategories`)
      .then((res) => {
        setCategories(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error);
  }, []);

  /* ================= LOAD ALL PRODUCTS ================= */
  const loadAllProducts = () => {
    setLoading(true);
    setActiveCategory("ALL");
    setActiveSubcategory(null);

    axios
      .get(`${API_BASE}/api/products`)
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  /* ================= LOAD PRODUCTS BY SUBCATEGORY ================= */
  const loadProductsBySubcategory = (subId) => {
    setLoading(true);
    setActiveSubcategory(subId);

    axios
      .get(`${API_BASE}/api/products/subcategory/${subId}`)
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  /* ================= HELPERS ================= */
  const activeCategoryObj =
    categories.find((c) => c.id === activeCategory) || null;

  const isComingSoon =
    COMING_SOON_CATEGORIES.includes(activeCategoryObj?.name);

  /* ================= IMAGE BUILDER (SAFE) ================= */
  const getSubcategoryImage = (image) => {
    if (!image) return "/no-image.png";
    if (image.startsWith("http")) return image;
    return `${API_BASE}/uploads/subcategories/${image}`;
  };

  return (
    <div className="bg-gray-100 min-h-screen pb-24">
      {/* 🔴 HERO */}
      <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-4 py-4 rounded-b-2xl">
        <h1 className="text-xl font-bold">Delivery in 30 Minutes ⚡</h1>
        <p className="text-xs opacity-90">Fresh groceries at your doorstep</p>
      </div>

      {/* 🔥 AD STRIP */}
      <div className="bg-red-100 px-4 py-3">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
            <FaTruck className="text-red-600 text-2xl" />
            <p className="font-semibold text-sm">Free Delivery</p>
          </div>

          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
            <FaFire className="text-red-600 text-2xl" />
            <p className="font-semibold text-sm">Today’s Deals</p>
          </div>

          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
            <FaTags className="text-red-600 text-2xl" />
            <p className="font-semibold text-sm">Offer Zone</p>
          </div>
        </div>
      </div>

      {/* 🟢 CATEGORY SLIDER */}
      <div className="flex gap-3 overflow-x-auto px-4 py-3 bg-white sticky top-0 z-10">
        <button
          onClick={loadAllProducts}
          className={`px-4 py-2 rounded-full text-sm font-medium ${
            activeCategory === "ALL"
              ? "bg-red-600 text-white"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setActiveCategory(cat.id);
              setActiveSubcategory(null);

              if (COMING_SOON_CATEGORIES.includes(cat.name)) {
                setProducts([]);
                return;
              }

              const firstSub = cat.subcategories?.[0];
              if (firstSub) loadProductsBySubcategory(firstSub.id);
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeCategory === cat.id
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 🟡 SUBCATEGORIES */}
      {activeCategory !== "ALL" && !isComingSoon && (
        <div className="flex gap-3 overflow-x-auto px-4 py-3">
          {activeCategoryObj?.subcategories?.map((sub) => (
            <button
              key={sub.id}
              onClick={() => loadProductsBySubcategory(sub.id)}
              className={`min-w-[90px] p-2 rounded-xl bg-white shadow text-center ${
                activeSubcategory === sub.id
                  ? "border-2 border-red-500"
                  : ""
              }`}
            >
              <img
                src={getSubcategoryImage(sub.image)}
                alt={sub.name}
                className="w-14 h-14 mx-auto rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/no-image.png";
                }}
              />
              <p className="text-xs mt-1 font-medium">{sub.name}</p>
            </button>
          ))}
        </div>
      )}

      {/* 🛒 PRODUCTS / COMING SOON */}
      <section className="mt-4 px-4">
        {isComingSoon && (
          <div className="w-full py-14 bg-red-100 border-2 border-red-600 rounded-xl text-center">
            <h2 className="text-4xl font-extrabold text-red-600">
              🚧 COMING SOON 🚧
            </h2>
            <p className="text-red-500 mt-3 font-medium">
              {activeCategoryObj?.name} category will be available shortly
            </p>
          </div>
        )}

        {!isComingSoon && (
          <>
            {loading && (
              <p className="text-sm text-gray-500">Loading products...</p>
            )}

            {!loading && products.length === 0 && (
              <p className="text-sm text-gray-500">
                No products available
              </p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-4">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

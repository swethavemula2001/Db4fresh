


import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTruck, FaFire, FaTags } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import TopPicks from "../components/TopPicks";
import CategoryRow from "../components/CategoryRow";

const API_BASE = "http://localhost:4000";

/* 🚧 COMING SOON CATEGORIES */
const COMING_SOON = [
  "beauty",
  "gym freaks",
  "fashion",
  "electronics",
  "pharmacy",
];

/* ⭐ PRIORITY ORDER */
const PRIORITY_CATEGORIES = ["fruits", "vegetables"];

export default function Home() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    async function loadHome() {
      try {
        setLoading(true);

        const [catRes, prodRes, topRes] = await Promise.all([
          axios.get(`${API_BASE}/api/categories/with-subcategories`),
          axios.get(`${API_BASE}/api/products`),
          axios.get(`${API_BASE}/api/products/top-picks`),
        ]);

        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setProducts(Array.isArray(prodRes.data) ? prodRes.data : []);
        setTopPicks(Array.isArray(topRes.data) ? topRes.data : []);
      } catch (err) {
        console.error("Home load error", err);
      } finally {
        setLoading(false);
      }
    }

    loadHome();
  }, []);

  /* ================= CATEGORY CLICK ================= */
  const onCategoryClick = (cat) => {
    if (COMING_SOON.includes(cat.name.toLowerCase())) {
      alert(`${cat.name} is coming soon 🚧`);
      return;
    }
    navigate(`/category/${cat.id}`);
  };

  /* ================= SHOP NOW → VEGETABLES ================= */
  const goToVegetables = () => {
    const vegCategory = categories.find(
      (c) => c.name.toLowerCase() === "vegetables"
    );

    if (!vegCategory) {
      alert("Vegetables category not found");
      return;
    }

    navigate(`/category/${vegCategory.id}`);
  };

  /* ================= PRODUCTS BY CATEGORY ================= */
  const getProductsForCategory = (categoryId) =>
    products.filter(
      (p) => String(p.category_id) === String(categoryId)
    );

  /* ================= CATEGORY ORDER ================= */
  const orderedCategories = [
    ...categories.filter((c) =>
      PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
    ),
    ...categories.filter(
      (c) => !PRIORITY_CATEGORIES.includes(c.name.toLowerCase())
    ),
  ];

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* ================= HERO STRIP ================= */}
      <div className="bg-gradient-to-r from-red-600 to-pink-500 text-white px-4 py-4">
        <h1 className="text-xl font-bold">Delivery in 30 Minutes ⚡</h1>
        <p className="text-xs opacity-90">
          Fresh groceries at your doorstep
        </p>
      </div>


      {/* AD STRIP */}
      {/* <div className="bg-red-100 px-4 py-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
            <FaTruck className="text-red-600 text-2xl" />
            Free Delivery
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
            <FaFire className="text-red-600 text-2xl" />
            Today’s Deals
          </div>
          <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow">
            <FaTags className="text-red-600 text-2xl" />
            Offer Zone
          </div>
        </div>
      </div> */}

      {/* ================= CATEGORY BAR ================= */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="grid grid-rows-2 grid-flow-col gap-x-4 gap-y-3 overflow-x-auto">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 rounded-full text-sm font-semibold
                       bg-red-600 text-white"
          >
            All
          </button>

          {orderedCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryClick(cat)}
              className="px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap
                         bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>



{/* ================= BANNER + DEALS (FIXED FIT) ================= */}
<div className="px-4 mt-6">
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">

    {/* ===== LEFT : BANNER (60%) ===== */}
    <div className="lg:col-span-3 bg-white rounded-2xl shadow overflow-hidden flex">
      <div className="relative w-full h-full min-h-[240px]">

        <img
          src="/Banner.png"
          alt="Fresh Vegetables"
          className="w-full h-full object-contain bg-gray-100"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/25 flex items-center justify-between px-6">
          <div className="text-white">
            <h2 className="text-3xl font-bold">Fresh Vegetables</h2>
            <p className="text-sm opacity-90">
              Delivered in 30 minutes
            </p>
          </div>

          <button
            onClick={goToVegetables}
            className="bg-white text-red-600 font-semibold
                       px-6 py-2 rounded-full hover:bg-red-50 transition"
          >
            Shop Now →
          </button>
        </div>
      </div>
    </div>

    {/* ===== RIGHT : DEALS (40%) ===== */}
    <div className="lg:col-span-2 flex flex-col gap-4">

      <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow">
        <FaTruck className="text-red-600 text-3xl" />
        <div>
          <h4 className="font-semibold">Free Delivery</h4>
          <p className="text-sm text-gray-500">On orders above ₹199</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow">
        <FaFire className="text-orange-500 text-3xl" />
        <div>
          <h4 className="font-semibold">Today’s Deals</h4>
          <p className="text-sm text-gray-500">Limited time discounts</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow">
        <FaTags className="text-pink-600 text-3xl" />
        <div>
          <h4 className="font-semibold">Offer Zone</h4>
          <p className="text-sm text-gray-500">Special combo offers</p>
        </div>
      </div>

    </div>
  </div>
</div>



      {/* ================= BANNER + DEALS (60 / 40) ================= */}
{/* <div className="px-4 mt-6">
  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch"> */}

    {/* ===== LEFT : BANNER (60%) ===== */}
    {/* <div className="lg:col-span-3 bg-white rounded-2xl shadow overflow-hidden">
      <div className="relative h-[260px]">
        <img
          src="/Banner.png"
          alt="Vegetables Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/35 flex items-center justify-between px-6">
          <div className="text-white">
            <h2 className="text-3xl font-bold">Fresh Vegetables</h2>
            <p className="text-sm opacity-90">
              Delivered in 30 minutes
            </p>
          </div>

          <button
            onClick={goToVegetables}
            className="bg-white text-red-600 font-semibold
                       px-6 py-2 rounded-full hover:bg-red-50 transition"
          >
            Shop Now →
          </button>
        </div>
      </div>
    </div> */}

    {/* ===== RIGHT : DEALS (40%) ===== */}
    {/* <div className="lg:col-span-2 flex flex-col gap-4">

      <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow hover:shadow-md transition">
        <FaTruck className="text-red-600 text-3xl" />
        <div>
          <h4 className="font-semibold">Free Delivery</h4>
          <p className="text-sm text-gray-500">
            On orders above ₹199
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow hover:shadow-md transition">
        <FaFire className="text-orange-500 text-3xl" />
        <div>
          <h4 className="font-semibold">Today’s Deals</h4>
          <p className="text-sm text-gray-500">
            Limited time discounts
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow hover:shadow-md transition">
        <FaTags className="text-pink-600 text-3xl" />
        <div>
          <h4 className="font-semibold">Offer Zone</h4>
          <p className="text-sm text-gray-500">
            Special combo offers
          </p>
        </div>
      </div>

    </div>
  </div>
</div> */}

      {/* ================= BANNER + DEALS ================= */}
{/* <div className="px-4 mt-6">
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"> */}

    {/* ===== LEFT : MAIN BANNER (50%) ===== */}
    {/* <div className="bg-white rounded-2xl shadow overflow-hidden">
      <div className="relative h-[260px]">
        <img
          src="/Banner.png"
          alt="Vegetables Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/35 flex items-center justify-between px-6">
          <div className="text-white">
            <h2 className="text-3xl font-bold">Fresh Vegetables</h2>
            <p className="text-sm opacity-90">
              Delivered in 30 minutes
            </p>
          </div>

          <button
            onClick={goToVegetables}
            className="bg-white text-red-600 font-semibold
                       px-6 py-2 rounded-full hover:bg-red-50 transition"
          >
            Shop Now →
          </button>
        </div>
      </div>
    </div> */}

    {/* ===== RIGHT : DEALS (50%) ===== */}
    {/* <div className="flex flex-col gap-4"> */}

      {/* Deal 1 */}
      {/* <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow hover:shadow-md transition">
        <FaTruck className="text-red-600 text-3xl" />
        <div>
          <h4 className="font-semibold">Free Delivery</h4>
          <p className="text-sm text-gray-500">
            On orders above ₹199
          </p>
        </div>
      </div> */}

      {/* Deal 2 */}
      {/* <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow hover:shadow-md transition">
        <FaFire className="text-orange-500 text-3xl" />
        <div>
          <h4 className="font-semibold">Today’s Deals</h4>
          <p className="text-sm text-gray-500">
            Limited time discounts
          </p>
        </div>
      </div> */}

      {/* Deal 3 */}
      {/* <div className="bg-white rounded-xl p-5 flex items-center gap-4 shadow hover:shadow-md transition">
        <FaTags className="text-pink-600 text-3xl" />
        <div>
          <h4 className="font-semibold">Offer Zone</h4>
          <p className="text-sm text-gray-500">
            Special combo offers
          </p>
        </div>
      </div>

    </div>
  </div>
</div> */}


      {/* ================= BANNER + DEALS ================= */}
      {/* <div className="px-4 mt-6">
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"> 
        <div className ="w-100wh h-100wh"> */}

          {/* BANNER */}
          {/* <div className="lg:col-span-2 bg-white rounded-2xl shadow overflow-hidden">
            <div className="relative h-[200px]">
              <img
                src="/Banner.png"
                alt="Vegetables Banner"
                className="w-full h-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-black/30 flex items-center justify-between px-6">
                <div className="text-white">
                  <h2 className="text-2xl font-bold">
                    Fresh Vegetables
                  </h2>
                  <p className="text-sm opacity-90">
                    Delivered in 30 minutes
                  </p>
                </div> */}

                {/* ✅ SHOP NOW → VEGETABLES */}
                {/* <button
                  onClick={goToVegetables}
                  className="bg-white text-red-600 font-semibold
                             px-6 py-2 rounded-full hover:bg-red-50 transition"
                >
                  Shop Now →
                </button>
              </div>
            </div>
          </div> */}

         

      {/* ================= HOME CONTENT ================= */}
      <div className="px-4 py-6">
        {loading ? (
          <p className="text-gray-500">Loading products...</p>
        ) : (
          <>
            <TopPicks products={topPicks} />

            {orderedCategories.map((cat) => {
              if (COMING_SOON.includes(cat.name.toLowerCase())) return null;

              const catProducts = getProductsForCategory(cat.id);
              if (!catProducts.length) return null;

              return (
                <CategoryRow
                  key={cat.id}
                  title={cat.name}
                  categoryId={cat.id}
                  products={catProducts}
                />
              );
            })}
          </>
        )}
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-16 py-6 text-center text-sm text-gray-500">
        © 2026 Db4fresh. All rights reserved.
      </div>
    </div>
  );
}

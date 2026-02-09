// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// const API = "http://localhost:4000";

// export default function Payment() {
//   const navigate = useNavigate();

//   const checkout =
//     JSON.parse(localStorage.getItem("checkout_data")) || {};

//   const {
//     totalAmount,
//     items,
//     paymentMethod,
//     addressId,
//     address_text,
//     delivery_date,
//     delivery_slot,
//   } = checkout;

//   const [method, setMethod] = useState(paymentMethod || "online");
//   const [loading, setLoading] = useState(false);

//   /* ================= SAFETY CHECK ================= */
//   useEffect(() => {
//     if (!totalAmount || !items?.length) {
//       navigate("/cart");
//     }
//   }, [totalAmount, items, navigate]);

//   /* ================= LOAD RAZORPAY SCRIPT ================= */
//   useEffect(() => {
//     if (window.Razorpay) return;
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     document.body.appendChild(script);
//   }, []);

//   /* ================= COD ================= */
//   const placeCODOrder = async () => {
//     try {
//       setLoading(true);

//       await axios.post(`${API}/api/orders`, {
//         items,
//         totalAmount,
//         address_id: addressId,
//         address_text,
//         delivery_date,
//         delivery_slot,
//         paymentMethod: "COD",
//       });

//       localStorage.removeItem("checkout_data");
//       navigate("/order-success");
//     } catch {
//       alert("Order failed ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= RAZORPAY (ZEPTO-LIKE) ================= */
//   const startPayment = async () => {
//     try {
//       setLoading(true);

//       const { data } = await axios.post(
//         `${API}/api/payment/create-order`,
//         { amount: totalAmount }
//       );

//       const options = {
//         key: import.meta.env.VITE_RAZORPAY_KEY,
//         amount: data.amount,
//         currency: "INR",
//         name: "Db4Fresh",
//         description: "Secure Payment",
//         order_id: data.id,

//         redirect: true,
//         callback_url: `${API}/api/payment/verify`,

//         // ✅ DYNAMIC USER PREFILL
//         prefill: {
//           name: address_text?.name || "",
//           contact: address_text?.phone || "",
//           email: address_text?.email || "",
//         },

//         theme: { color: "#6b21a8" }, // Zepto-like purple
//       };

//       new window.Razorpay(options).open();
//     } catch {
//       alert("Payment failed ❌");
//       setLoading(false);
//     }
//   };

//   /* ================= PAY ================= */
//   const handlePay = () => {
//     if (loading) return;
//     method === "cod" ? placeCODOrder() : startPayment();
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6">
//       <h2 className="text-xl font-bold mb-4">Payment Options</h2>

//       <div className="space-y-3">
//         <PaymentOption
//           label="Online Payment (UPI / Card / Wallet / NetBanking)"
//           value="online"
//           method={method}
//           setMethod={setMethod}
//           disabled={loading}
//         />
//         <PaymentOption
//           label="Cash on Delivery"
//           value="cod"
//           method={method}
//           setMethod={setMethod}
//           disabled={loading}
//         />
//       </div>

//       <button
//         disabled={loading}
//         onClick={handlePay}
//         className="w-full mt-6 bg-purple-700 text-white py-3 rounded-lg text-lg font-semibold disabled:opacity-60"
//       >
//         {loading
//           ? "Redirecting to secure payment..."
//           : method === "cod"
//           ? "Place Order"
//           : `Pay ₹${totalAmount}`}
//       </button>
//     </div>
//   );
// }

// function PaymentOption({ label, value, method, setMethod, disabled }) {
//   return (
//     <label className="flex items-center gap-3 border p-3 rounded cursor-pointer hover:bg-gray-50">
//       <input
//         type="radio"
//         disabled={disabled}
//         checked={method === value}
//         onChange={() => setMethod(value)}
//       />
//       <span>{label}</span>
//     </label>
//   );
// }



import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:4000";

export default function Payment() {
  const navigate = useNavigate();

  const checkout =
    JSON.parse(localStorage.getItem("checkout_data")) || {};

  const {
    totalAmount,
    items,
    paymentMethod,
    address_text,
    delivery_date,
    delivery_slot,
    userId,
  } = checkout;

  const [method, setMethod] = useState(paymentMethod || "online");
  const [loading, setLoading] = useState(false);

  /* ================= SAFETY CHECK ================= */
  useEffect(() => {
    if (!totalAmount || !items?.length) {
      navigate("/cart");
    }
  }, [totalAmount, items, navigate]);

  /* ================= LOAD RAZORPAY SCRIPT ================= */
  useEffect(() => {
    if (window.Razorpay) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    document.body.appendChild(script);
  }, []);

  /* ================= COD ================= */
  const placeCODOrder = async () => {
    try {
      setLoading(true);

      await axios.post(`${API}/api/orders`, {
        items,
        totalAmount,
        address: address_text,
        delivery_date,
        delivery_slot,
        userId,
        paymentMethod: "COD",
      });

      localStorage.removeItem("checkout_data");
      navigate("/order-success");
    } catch {
      alert("Order failed ❌");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ONLINE PAYMENT ================= */
  const startPayment = async () => {
    try {
      setLoading(true);

      /* 🔥 STEP 1: CREATE DB ORDER (PENDING) */
      const orderRes = await axios.post(`${API}/api/orders`, {
        items,
        totalAmount,
        address: address_text,
        delivery_date,
        delivery_slot,
        userId,
        paymentMethod: "online",
      });

      const orderId = orderRes.data.orderId;

      /* 🔥 STEP 2: CREATE RAZORPAY ORDER */
      const { data } = await axios.post(
        `${API}/api/payment/create-order`,
        { amount: totalAmount }
      );

      /* 🔥 STEP 3: RAZORPAY CHECKOUT */
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.amount,
        currency: "INR",
        name: "Db4Fresh",
        description: "Secure Payment",
        order_id: data.id,

        redirect: true,
        callback_url: `${API}/api/payment/verify?orderId=${orderId}`,

        prefill: {
          name: address_text?.name || "",
          contact: address_text?.phone || "",
          email: address_text?.email || "",
        },

        theme: { color: "#6b21a8" },
      };

      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      alert("Payment failed ❌");
      setLoading(false);
    }
  };

  /* ================= PAY ================= */
  const handlePay = () => {
    if (loading) return;
    method === "cod" ? placeCODOrder() : startPayment();
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Payment Options</h2>

      <div className="space-y-3">
        <PaymentOption
          label="Online Payment (UPI / Card / Wallet / NetBanking)"
          value="online"
          method={method}
          setMethod={setMethod}
          disabled={loading}
        />
        <PaymentOption
          label="Cash on Delivery"
          value="cod"
          method={method}
          setMethod={setMethod}
          disabled={loading}
        />
      </div>

      <button
        disabled={loading}
        onClick={handlePay}
        className="w-full mt-6 bg-purple-700 text-white py-3 rounded-lg text-lg font-semibold disabled:opacity-60"
      >
        {loading
          ? "Redirecting to secure payment..."
          : method === "cod"
          ? "Place Order"
          : `Pay ₹${totalAmount}`}
      </button>
    </div>
  );
}

function PaymentOption({ label, value, method, setMethod, disabled }) {
  return (
    <label className="flex items-center gap-3 border p-3 rounded cursor-pointer hover:bg-gray-50">
      <input
        type="radio"
        disabled={disabled}
        checked={method === value}
        onChange={() => setMethod(value)}
      />
      <span>{label}</span>
    </label>
  );
}

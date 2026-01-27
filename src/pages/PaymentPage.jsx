import { useState } from "react";

export default function PaymentPage() {
  const [method, setMethod] = useState("upi");

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-xl font-semibold mb-4">Payment</h2>

      {/* Amount */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <p className="text-gray-500">Final Amount</p>
        <h3 className="text-2xl font-bold">₹80</h3>
        <p className="text-green-600 text-sm">Secured Payment 🔒</p>
      </div>

      {/* Recommended Payments */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <h4 className="font-semibold mb-2">Recommended Payments</h4>

        <label className="flex items-center gap-3 mb-2">
          <input
            type="radio"
            checked={method === "upi"}
            onChange={() => setMethod("upi")}
          />
          GPay / UPI / Paytm
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            checked={method === "wallet"}
            onChange={() => setMethod("wallet")}
          />
          Wallet
        </label>
      </div>

      {/* Other Payment Options */}
      <div className="bg-white p-4 rounded-lg mb-4">
        <h4 className="font-semibold mb-2">Other Options</h4>

        <label className="flex items-center gap-3 mb-2">
          <input
            type="radio"
            checked={method === "card"}
            onChange={() => setMethod("card")}
          />
          Debit / Credit Card
        </label>

        <label className="flex items-center gap-3 mb-2">
          <input
            type="radio"
            checked={method === "netbanking"}
            onChange={() => setMethod("netbanking")}
          />
          Net Banking
        </label>

        <label className="flex items-center gap-3">
          <input
            type="radio"
            checked={method === "cod"}
            onChange={() => setMethod("cod")}
          />
          Cash on Delivery
        </label>
      </div>

      {/* Pay Button */}
      <button
        onClick={() => alert(`Payment via ${method}`)}
        className="bg-pink-500 text-white w-full py-3 rounded-lg font-semibold"
      >
        Pay ₹80
      </button>
    </div>
  );
}

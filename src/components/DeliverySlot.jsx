// // import React, { useState } from "react";

// // const slots = [
// //   "6:00 AM - 8:00 AM",
// //   "8:00 AM - 10:00 AM",
// //   "10:00 AM - 12:00 PM",
// //   "12:00 PM - 2:00 PM",
// // ];

// // export default function DeliverySlot({ onSelect }) {
// //   const today = new Date().toISOString().split("T")[0];
// //   const tomorrow = new Date(Date.now() + 86400000)
// //     .toISOString()
// //     .split("T")[0];

// //   const [date, setDate] = useState(today);
// //   const [slot, setSlot] = useState("");

// //   const handleSelect = (s) => {
// //     setSlot(s);
// //     onSelect({
// //       date,
// //       time: s,
// //     });
// //   };

// //   return (
// //     <div className="mt-4">
// //       <h3 className="font-semibold mb-2">Select Delivery Slot</h3>

// //       {/* DATE SELECTOR */}
// //       <div className="flex gap-2 mb-3">
// //         <button
// //           onClick={() => setDate(today)}
// //           className={`px-3 py-1 rounded ${
// //             date === today ? "bg-red-600 text-white" : "bg-gray-100"
// //           }`}
// //         >
// //           Today
// //         </button>

// //         <button
// //           onClick={() => setDate(tomorrow)}
// //           className={`px-3 py-1 rounded ${
// //             date === tomorrow ? "bg-red-600 text-white" : "bg-gray-100"
// //           }`}
// //         >
// //           Tomorrow
// //         </button>
// //       </div>

// //       {/* SLOT LIST */}
// //       <div className="grid grid-cols-2 gap-2">
// //         {slots.map((s) => (
// //           <button
// //             key={s}
// //             onClick={() => handleSelect(s)}
// //             className={`border px-2 py-2 rounded text-sm ${
// //               slot === s
// //                 ? "border-red-600 bg-red-50"
// //                 : "border-gray-300"
// //             }`}
// //           >
// //             {s}
// //           </button>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
// import { useState } from "react";

// export default function DeliverySlot({ onChange }) {
//   const [day, setDay] = useState("Today");
//   const [slot, setSlot] = useState(null);

//   const slots = [
//     "6:00 AM - 8:00 AM",
//     "8:00 AM - 10:00 AM",
//     "10:00 AM - 12:00 PM",
//     "12:00 PM - 2:00 PM",
//   ];

//   const selectSlot = (time) => {
//     setSlot(time);
//     onChange({
//       date: day,
//       time,
//     });
//   };

//   return (
//     <>
//       <div className="flex gap-3 mb-4">
//         <button
//           onClick={() => setDay("Today")}
//           className={`px-4 py-1 rounded ${
//             day === "Today"
//               ? "bg-red-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           Today
//         </button>
//         <button
//           onClick={() => setDay("Tomorrow")}
//           className={`px-4 py-1 rounded ${
//             day === "Tomorrow"
//               ? "bg-red-600 text-white"
//               : "bg-gray-200"
//           }`}
//         >
//           Tomorrow
//         </button>
//       </div>

//       <div className="grid grid-cols-2 gap-3">
//         {slots.map((s) => (
//           <button
//             key={s}
//             onClick={() => selectSlot(s)}
//             className={`border p-2 rounded ${
//               slot === s
//                 ? "border-red-600 text-red-600"
//                 : ""
//             }`}
//           >
//             {s}
//           </button>
//         ))}
//       </div>
//     </>
//   );
// }
import React, { useState } from "react";

const SLOTS = [
  "6:00 AM - 9:00 AM",
  "9:00 AM - 12:00 PM",
  "12:00 PM - 3:00 PM",
  "3:00 PM - 6:00 PM",
  "6:00 PM - 9:00 PM",
];

const EXPRESS_SLOT = "Express (30 mins)";

export default function DeliverySlot({ onChange }) {
  const [day, setDay] = useState("Today");
  const [selectedTime, setSelectedTime] = useState("");

  const handleSelect = (time) => {
    setSelectedTime(time);
    onChange({
      date: day,
      time: time,
    });
  };

  return (
    <div>
      {/* Day Selector */}
      <div className="flex gap-3 mb-4">
        {["Today", "Tomorrow"].map((d) => (
          <button
            key={d}
            onClick={() => {
              setDay(d);
              setSelectedTime("");
            }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium ${
              day === d
                ? "bg-red-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Slots */}
      <div className="grid grid-cols-2 gap-3">
        {SLOTS.map((slot) => (
          <button
            key={slot}
            onClick={() => handleSelect(slot)}
            className={`border rounded-lg py-2 text-sm ${
              selectedTime === slot
                ? "border-red-500 bg-red-50 text-red-600"
                : "border-gray-300"
            }`}
          >
            {slot}
          </button>
        ))}

        {/* Express Slot */}
        <button
          onClick={() => handleSelect(EXPRESS_SLOT)}
          className={`col-span-2 border rounded-lg py-2 text-sm font-medium ${
            selectedTime === EXPRESS_SLOT
              ? "border-orange-500 bg-orange-50 text-orange-600"
              : "border-orange-400 text-orange-600"
          }`}
        >
          🚀 {EXPRESS_SLOT}
        </button>
      </div>
    </div>
  );
}

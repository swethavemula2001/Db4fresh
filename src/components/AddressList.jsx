// // import axios from "axios";
// // import { useEffect, useState } from "react";

// // export default function AddressList({ onSelect }) {
// //   const [addresses, setAddresses] = useState([]);

// //   useEffect(() => {
// //     axios.get("/api/addresses", authHeader())
// //       .then(res => {
// //         setAddresses(res.data);
// //         const def = res.data.find(a => a.is_default);
// //         if (def) onSelect(def);
// //       });
// //   }, []);

// //   return (
// //     <div>
// //       {addresses.map(a => (
// //         <div key={a.id} className="border p-3 mb-2">
// //           <input
// //             type="radio"
// //             name="address"
// //             defaultChecked={a.is_default}
// //             onChange={() => onSelect(a)}
// //           />
// //           <span className="ml-2">
// //             {a.address_line1}, {a.city}
// //           </span>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }
// import axios from "axios";
// import { useEffect, useState } from "react";

// export default function AddressList({ onSelect }) {
//   const [addresses, setAddresses] = useState([]);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     if (!token) return;

//     axios
//       .get("http://localhost:4000/api/addresses", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((res) => {
//         const list = res.data.addresses || [];

//         setAddresses(list);

//         // ✅ auto-select default or first address
//         const def = list.find((a) => a.is_default) || list[0];
//         if (def && onSelect) onSelect(def);
//       })
//       .catch((err) => {
//         console.error("FETCH ADDRESSES ERROR:", err);
//       });
//   }, [token, onSelect]);

//   if (!addresses.length) {
//     return (
//       <p className="text-sm text-gray-500">
//         No saved addresses
//       </p>
//     );
//   }

//   return (
//     <div className="space-y-2">
//       {addresses.map((a) => (
//         <label
//           key={a.id}
//           className="flex items-start gap-3 border p-3 rounded-lg cursor-pointer hover:border-red-500"
//         >
//           <input
//             type="radio"
//             name="address"
//             checked={a.is_default}
//             onChange={() => onSelect(a)}
//           />

//           <div className="text-sm">
//             <p className="font-semibold">{a.name}</p>
//             <p>
//               {a.address_line2 || "—"}
//             </p>
//             <p>{a.pincode}</p>
//           </div>
//         </label>
//       ))}
//     </div>
//   );
// }
import axios from "axios";
import { useEffect, useState } from "react";

export default function AddressList({ onSelect }) {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:4000/api/addresses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const list = res.data.addresses || [];
        setAddresses(list);

        // ✅ select default or first
        const def = list.find((a) => a.is_default) || list[0];
        if (def) {
          setSelectedId(def.id);
          onSelect(def);
        }
      })
      .catch((err) => {
        console.error("ADDRESS FETCH ERROR:", err);
      });
  }, [token, onSelect]);

  if (!addresses.length) {
    return <p className="text-sm text-gray-500">No saved addresses</p>;
  }

  return (
    <div className="space-y-3">
      {addresses.map((a) => (
        <label
          key={a.id}
          className={`flex gap-3 border p-3 rounded-lg cursor-pointer
            ${selectedId === a.id ? "border-red-500" : ""}`}
        >
          <input
            type="radio"
            name="address"
            checked={selectedId === a.id}
            onChange={() => {
              setSelectedId(a.id);
              onSelect(a);
            }}
          />

          <div className="text-sm">
            <p className="font-semibold">{a.name}</p>
            <p>{a.address_line2 || "-"}</p>
            <p>{a.pincode}</p>
          </div>
        </label>
      ))}
    </div>
  );
}

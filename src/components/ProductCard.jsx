// import React from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addToWishlist,
//   removeFromWishlist,
// } from "../features/wishlist/wishlistSlice";
// import { FaHeart, FaRegHeart } from "react-icons/fa";
// import AddToCartButton from "./AddToCartButton";

// /* IMAGE HELPER */
// const getImageUrl = (p) => {
//   if (Array.isArray(p.images) && p.images.length > 0) {
//     const img = p.images[0];
//     if (typeof img === "string") return img;
//     if (typeof img === "object" && img.url) return img.url;
//   }
//   return "/placeholder.png";
// };

// export default function ProductCard({ p }) {
//   const dispatch = useDispatch();
//   const wishlist = useSelector((s) => s.wishlist.items);

//   const productId = p?.id;
//   if (!productId) return null;

//   const img = getImageUrl(p);

//   const defaultVariant =
//     Array.isArray(p.variants) && p.variants.length > 0
//       ? p.variants[0]
//       : null;

//   const price = defaultVariant?.price || p.price || 0;
//   const stock =
//     defaultVariant?.stock ??
//     Number(p.stock) ??
//     0;

//   const variantLabel = defaultVariant?.variant_label || "";

//   const isWishlisted = wishlist.some(
//     (i) => i.productId === productId
//   );

//   const handleWishlist = (e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (isWishlisted) {
//       dispatch(removeFromWishlist(productId));
//     } else {
//       dispatch(
//         addToWishlist({
//           productId,
//           name: p.name,
//           price,
//           image: img,
//           variantLabel,
//         })
//       );
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 w-[160px]">

//       {/* IMAGE */}
//       <Link to={`/product/${productId}`}>
//         <div className="relative bg-[#f6f6f6] border border-gray-200 rounded-lg w-[120px] h-[120px] mx-auto flex items-center justify-center overflow-hidden">

//           {/* ❤️ Wishlist */}
//           <button
//             onClick={handleWishlist}
//             className="absolute top-1 right-1 bg-white rounded-full p-1 shadow z-10"
//           >
//             {isWishlisted ? (
//               <FaHeart className="text-red-600" size={14} />
//             ) : (
//               <FaRegHeart className="text-gray-400" size={14} />
//             )}
//           </button>

//           <img
//             src={img}
//             alt={p.name}
//             loading="lazy"
//             className="w-full h-full object-contain p-2"
//           />
//         </div>
//       </Link>

//       {/* NAME */}
//       <h3 className="text-sm font-medium mt-2 line-clamp-2">
//         {p.name}
//       </h3>

//       {/* VARIANT */}
//       {variantLabel && (
//         <p className="text-xs text-gray-500 mt-1">
//           {variantLabel}
//         </p>
//       )}

//       {/* PRICE + CART */}
//       <div className="flex items-center justify-between mt-2">
//         <span className="font-bold text-sm">
//           ₹{price}
//         </span>

//         {stock <= 0 ? (
//           <span className="text-xs text-red-500 font-semibold">
//             Out of Stock
//           </span>
//         ) : (
//           <AddToCartButton
//             productId={productId}
//             name={p.name}
//             price={price}
//             image={img}
//             variantId={defaultVariant?.id}
//             variantLabel={variantLabel}
//             stock={stock}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "../features/wishlist/wishlistSlice";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import AddToCartButton from "./AddToCartButton";



/* IMAGE HELPER */
const getImageUrl = (p) => {
  if (Array.isArray(p.images) && p.images.length > 0) {
    const img = p.images[0];
    if (typeof img === "string") return img;
    if (typeof img === "object" && img.url) return img.url;
  }
  return "/placeholder.png";
};

export default function ProductCard({ p }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((s) => s.wishlist.items);

  const productId = p?.id;
  console.log("🟢 ProductCard received:", p);
  if (!productId) return null;

  const img = getImageUrl(p);

  const defaultVariant =
    Array.isArray(p.variants) && p.variants.length > 0
      ? p.variants[0]
      : null;

  const price = defaultVariant?.price || p.price || 0;
  const stock =
    defaultVariant?.stock ??
    Number(p.stock) ??
    0;


  const variantLabel = defaultVariant?.variant_label || "";

  const isWishlisted = wishlist.some(
    (i) => i.productId === productId
  );

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));
    } else {
      dispatch(
        addToWishlist({
          productId,
          name: p.name,
          price,
          image: img,
          variantLabel,
        })
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-3 w-[160px]">

      {/* IMAGE */}
      <Link to={`/product/${productId}`}>
        <div className="relative bg-white border border-gray-200 rounded-lg w-[120px] h-[120px] mx-auto overflow-hidden">

          {/* ❤️ Wishlist */}
          <button
            onClick={handleWishlist}
            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow z-10"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-600" size={14} />
            ) : (
              <FaRegHeart className="text-gray-400" size={14} />
            )}
          </button>

          {/* IMAGE FILLS FULL BOX */}
          <img
            src={img}
            alt={p.name}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      {/* NAME */}
      <h3 className="text-sm font-medium mt-2 line-clamp-2">
        {p.name}
      </h3>

      {/* VARIANT */}
      {variantLabel && (
        <p className="text-xs text-gray-500 mt-1">
          {variantLabel}
        </p>
      )}

      {/* PRICE + CART */}
      <div className="flex items-center justify-between mt-2">
        <span className="font-bold text-sm">
          ₹{price}
        </span>

        {stock <= 0 ? (
          <span className="text-xs text-red-500 font-semibold">
            Out of Stock
          </span>
        ) : (
          <AddToCartButton
            productId={productId}
            name={p.name}
            price={price}
            image={img}
            variantId={defaultVariant?.id }
            variantLabel={variantLabel }
            stock={stock}
          />

        )}
      </div>
    </div>
  );
}

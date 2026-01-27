// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import ProductCard from "../components/ProductCard";

// export default function SubcategoryProducts() {
//   const { id } = useParams();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     axios
//       .get(`http://localhost:4000/api/products/subcategory/${id}`)
//       .then(res => setProducts(res.data));
//   }, [id]);

//   return (
//     <div className="product-grid">
//       {products.map(p => (
//         <ProductCard key={p.id} product={p} />
//       ))}
//     </div>
//   );
// }


import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function SubcategoryProducts() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:4000/api/products/subcategory/${id}`
        );
        setProducts(res.data || []);
      } catch (err) {
        console.error("Subcategory fetch error:", err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500">
        Loading products…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-500">
        {error}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-10 text-gray-400">
        No products found in this subcategory
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4">
      {products.map((p) => (
        <ProductCard key={p.id} p={p} />
      ))}
    </div>
  );
}

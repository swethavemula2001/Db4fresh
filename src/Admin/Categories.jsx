import { useEffect, useState } from "react";
import axios from "axios";
 
export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("ACTIVE");
 
  useEffect(() => {
    fetchCategories();
  }, []);
 
  const fetchCategories = async () => {
    const res = await axios.get(
      "http://localhost:4000/api/admin/categories"
    );
    setCategories(res.data);
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (editingId) {
      await axios.put(
        `http://localhost:4000/api/admin/categories/${editingId}`,
        { name, status }
      );
    } else {
      await axios.post(
        "http://localhost:4000/api/admin/categories",
        { name }
      );
    }
 
    setName("");
    setStatus("ACTIVE");
    setEditingId(null);
    fetchCategories();
  };
 
  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setStatus(cat.status);
  };
 
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
 
    try {
      await axios.delete(
        `http://localhost:4000/api/admin/categories/${id}`
      );
      fetchCategories();
    } catch (err) {
      alert(err.response.data.message);
    }
  };
 
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        Categories
      </h2>
 
      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-3 mb-6"
      >
        <input
          className="border px-3 py-2 rounded w-1/3"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
 
        {editingId && (
          <select
            className="border px-3 py-2 rounded"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        )}
 
        <button className="bg-red-600 text-white px-4 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>
 
      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.status}</td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="text-blue-600 mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


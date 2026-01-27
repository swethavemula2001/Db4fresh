import { Link } from "react-router-dom";

export default function SearchSuggestions({ results, onSelect }) {
  if (!results || results.length === 0) {
    return (
      <div className="absolute top-10 bg-white shadow-lg w-full rounded p-3 text-gray-500 z-50">
        No suggestions.
      </div>
    );
  }

  return (
    <div className="absolute top-10 bg-white shadow-lg w-full rounded p-2 z-50">
      {results.map((p) => (
        <Link
          key={p.id}
          to={`/product/${p.id}`}
          onClick={() => onSelect(p.name)}
          className="block px-3 py-2 hover:bg-gray-100 text-sm"
        >
          {p.name}
        </Link>
      ))}
    </div>
  );
}

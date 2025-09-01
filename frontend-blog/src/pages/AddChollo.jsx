import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAdminToken } from "../utils/adminToken";

export default function AddChollo() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    image: "",
    price: "",
    link: "",
    category_id: ""
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories")
      .then(res => setCategories(res.data))
      .catch(console.error);
  }, []);

  const handleChange = e => {
    let { name, value } = e.target;
    if (name === "category_id") {
      value = value === "" ? null : Number(value);
    }
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    let link = form.link;
    if (link && !/^https?:\/\//i.test(link)) link = "https://" + link;
    try {
      await axios.post(
        "http://localhost:5000/api/posts",
        { ...form, link },
        { headers: { "x-admin-token": getAdminToken() } }
      );
      setMsg("✅ ¡Chollo publicado!");
      setTimeout(() => navigate("/"), 1400);
    } catch {
      setMsg("❌ Error al publicar");
    }
    setLoading(false);
  };

  return (
    <div
      className="relative flex flex-col min-h-screen bg-transparent overflow-x-hidden items-center justify-start py-8"
      style={{ overflowY: "hidden" }}
    >
      {/* Decoraciones iguales al Home y Filtros */}
      <div className="absolute -top-28 -left-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-28 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-300/20 rounded-full blur-xl pointer-events-none" />
      
      {/* Espaciado para navbar */}
      <div className="h-20 md:h-24" />
      
      <form
        className="relative z-10 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 md:w-[480px] w-full max-w-xl space-y-6 border border-purple-200"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold mb-4 text-center text-blue-800 drop-shadow">
          🚀 Añadir un nuevo chollo
        </h2>

        <input
          className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-300 p-4 w-full rounded-xl text-lg shadow-lg transition-all focus:outline-none"
          placeholder="Título del chollo"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-300 p-4 w-full rounded-xl text-lg shadow-lg transition-all resize-none focus:outline-none"
          placeholder="Descripción"
          rows={4}
          name="content"
          value={form.content}
          onChange={handleChange}
          required
        />

        <input
          className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-300 p-4 w-full rounded-xl text-lg shadow-lg transition-all focus:outline-none"
          placeholder="URL de la imagen"
          name="image"
          value={form.image}
          onChange={handleChange}
        />

        <input
          className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-300 p-4 w-full rounded-xl text-lg shadow-lg transition-all focus:outline-none"
          placeholder="Enlace del chollo"
          name="link"
          value={form.link}
          onChange={handleChange}
          required
        />

        <input
          className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-300 p-4 w-full rounded-xl text-lg shadow-lg transition-all focus:outline-none"
          placeholder="Precio (€)"
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          min="0"
          step=".01"
        />

        <select
          className="border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-300 p-4 w-full rounded-xl text-lg shadow-lg transition-all focus:outline-none"
          name="category_id"
          value={form.category_id ?? ""}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.icon} {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="block w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold p-4 rounded-xl shadow-lg text-xl transition-all hover:scale-105 disabled:scale-100 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Publicando...
            </div>
          ) : (
            "Publicar chollo 🚀"
          )}
        </button>

        {msg && (
          <div
            className={`text-center text-lg mt-2 font-bold ${
              msg.startsWith('✅') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}

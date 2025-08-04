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
    // Convierte category_id a número para enviar al backend correctamente
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
        {
          headers: { "x-admin-token": getAdminToken() }
        }
      );
      setMsg("✅ ¡Chollo publicado!");
      setTimeout(() => navigate("/"), 1400);
    } catch {
      setMsg("❌ Error al publicar");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 via-blue-100 to-white py-16">
      <form
        className="bg-white rounded-[2rem] shadow-2xl p-10 md:w-[400px] w-full max-w-xl space-y-5 border-4 border-blue-200"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-bold mb-1 text-center text-blue-700">🚀 Añadir un nuevo chollo</h2>

        <input
          className="border-2 border-blue-100 focus:border-blue-700 focus:ring-blue-100 p-3 w-full rounded-lg text-lg shadow"
          placeholder="Título del chollo"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          className="border-2 border-blue-100 focus:border-blue-700 p-3 w-full rounded-lg text-lg shadow"
          placeholder="Descripción"
          rows={3}
          name="content"
          value={form.content}
          onChange={handleChange}
          required
        />

        <input
          className="border-2 border-blue-100 focus:border-blue-700 p-3 w-full rounded-lg text-lg shadow"
          placeholder="URL de la imagen"
          name="image"
          value={form.image}
          onChange={handleChange}
        />

        <input
          className="border-2 border-blue-100 focus:border-blue-700 p-3 w-full rounded-lg text-lg shadow"
          placeholder="Enlace del chollo"
          name="link"
          value={form.link}
          onChange={handleChange}
          required
        />

        <input
          className="border-2 border-blue-100 focus:border-blue-700 p-3 w-full rounded-lg text-lg shadow"
          placeholder="Precio (€)"
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          min="0"
          step=".01"
        />

        <select
          className="border-2 border-blue-100 focus:border-blue-700 p-3 w-full rounded-lg text-lg shadow"
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
          className="block w-full bg-gradient-to-tr from-blue-500 to-blue-800 text-white font-bold p-3 rounded-xl mt-4 shadow-lg text-xl hover:from-pink-500 hover:to-yellow-500 transition"
          disabled={loading}
        >
          {loading ? "Publicando..." : "Publicar chollo 🚀"}
        </button>

        {msg && <div className="text-center text-lg mt-2 font-bold text-green-600">{msg}</div>}
      </form>
    </div>
  );
}

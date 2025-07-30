import { useState } from "react";
import axios from "axios";

export default function NewPostForm({ onPostCreated }) {
  const [form, setForm] = useState({ title: "", content: "", image: "", price: "", link: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await axios.post("http://localhost:5000/api/posts", form);
      setMsg("Chollo publicado!");
      setForm({ title: "", content: "", image: "", price: "", link: "" });
      if (onPostCreated) onPostCreated();
    } catch {
      setMsg("❌ Error al publicar el chollo");
    }
    setLoading(false);
    setTimeout(() => setMsg(""), 1800);
  };

  return (
    <form className="bg-white rounded-2xl shadow p-6 mb-8 space-y-3" onSubmit={handleSubmit}>
      <h2 className="font-semibold text-lg mb-3 text-blue-700">Añadir nuevo chollo</h2>
      <input className="border p-2 w-full rounded" placeholder="Título" name="title" value={form.title} onChange={handleChange} required />
      <textarea className="border p-2 w-full rounded" placeholder="Descripción" rows={3} name="content" value={form.content} onChange={handleChange} required />
      <input className="border p-2 w-full rounded" placeholder="URL de la imagen" name="image" value={form.image} onChange={handleChange} />
      <input className="border p-2 w-full rounded" placeholder="Enlace del chollo" name="link" value={form.link} onChange={handleChange} required />
      <input className="border p-2 w-full rounded" placeholder="Precio (€)" name="price" value={form.price} onChange={handleChange} type="number" min="0" step=".01" />
      <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded w-full font-bold" disabled={loading}>
        {loading ? "Publicando..." : "Publicar"}
      </button>
      {msg && <div className="text-center text-green-600 font-semibold">{msg}</div>}
    </form>
  );
}

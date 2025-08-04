import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

export default function ModalEditPost({ isOpen, post, onSave, onCancel }) {
  const [form, setForm] = useState(post || {});
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setForm(post || {});
  }, [post]);

  useEffect(() => {
    // Carga categorías disponibles para seleccionar
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



  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    onSave(form, () => setLoading(false));
  };

  const modalContent = (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-400/30 via-blue-300/20 to-pink-200/40 backdrop-blur-[3px]" />
      <form
        className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full space-y-4 border-t-8 border-blue-500 animate-fade-in"
        onSubmit={handleSubmit}
        style={{ zIndex: 10 }}
      >
        <h2 className="bg-gradient-to-r from-blue-500 via-purple-400 to-pink-400 text-white text-2xl font-black rounded-xl py-2 px-4 text-center mb-5 shadow-lg drop-shadow">
          Editar Chollo
        </h2>
        <div className="flex flex-col gap-4">
          <input
            className="border-2 border-blue-200 focus:border-blue-600 p-3 rounded-lg shadow-sm bg-blue-50/70 font-semibold"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            placeholder="Título"
            required
          />
          <textarea
            className="border-2 border-purple-200 focus:border-purple-500 p-3 rounded-lg shadow-sm bg-purple-50/70"
            name="content"
            value={form.content || ""}
            onChange={handleChange}
            placeholder="Descripción"
            rows={3}
            required
          />
          <input
            className="border-2 border-pink-200 focus:border-pink-500 p-3 rounded-lg shadow-sm bg-pink-50/70"
            name="image"
            value={form.image || ""}
            onChange={handleChange}
            placeholder="URL de la imagen"
          />
          <input
            className="border-2 border-blue-100 focus:border-blue-500 p-3 rounded-lg shadow-sm"
            name="link"
            value={form.link || ""}
            onChange={handleChange}
            placeholder="Enlace del chollo"
            required
          />
          <input
            className="border-2 border-green-200 focus:border-green-400 p-3 rounded-lg shadow-sm"
            name="price"
            value={form.price || ""}
            onChange={handleChange}
            placeholder="Precio (€)"
            type="number"
            min="0"
            step=".01"
          />

          <select
            className="border-2 border-violet-300 focus:border-violet-600 p-3 rounded-lg shadow-sm bg-violet-50/50 font-semibold"
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
        </div>

        <div className="flex justify-end gap-4 mt-7">
          <button
            type="button"
            className="px-5 py-2 rounded-lg bg-gray-200/80 hover:bg-gray-400/80 text-gray-700 font-semibold shadow transition"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-gradient-to-tr from-blue-500 via-pink-500 to-yellow-400 text-white font-bold shadow-lg hover:from-yellow-400 hover:to-blue-600 transition"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );

  if (!isOpen || !post) return null;
  return createPortal(modalContent, document.getElementById("modal-root"));
}

import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard.jsx";
import ModalConfirm from "../components/ModalConfirm.jsx";
import ModalEditPost from "../components/ModalEditPost.jsx";
import FilterSystem from "../components/FilterSystem.jsx";
import { getAdminToken } from "../utils/adminToken";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);

  // Modal confirmación borrar
  const [modalOpen, setModalOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  // Modal edición
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  // Filtros
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    dateRange: '',
    searchText: '',
    sortBy: 'newest'
  });

  const [categories, setCategories] = useState([]);

  // Datos para mostrar/posts
  const fetchPosts = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/posts")
      .then(res => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const fetchCategories = () => {
    axios
      .get('http://localhost:5000/api/categories')
      .then(res => setCategories(res.data))
      .catch(console.error);
  };

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    const token = getAdminToken();
    if (token) setAdminMode(true);
  }, []);

  // Borrar
  const openDeleteModal = id => {
    setToDeleteId(id);
    setModalOpen(true);
  };
  const closeDeleteModal = () => {
    setToDeleteId(null);
    setModalOpen(false);
  };
  const handleDeleteConfirm = async () => {
    if (!toDeleteId) return;
    try {
      await axios.delete(`http://localhost:5000/api/posts/${toDeleteId}`, {
        headers: { "x-admin-token": getAdminToken() }
      });
      setPosts(posts.filter(post => post.id !== toDeleteId));
      closeDeleteModal();
    } catch (error) {
      alert("Error al borrar el chollo o no tienes permiso");
      closeDeleteModal();
    }
  };

  // Editar
  const openEditModal = post => {
    setEditingPost(post);
    setModalEditOpen(true);
  };
  const closeEditModal = () => {
    setModalEditOpen(false);
    setEditingPost(null);
  };
  const handleEditSave = async (data, done) => {
    try {
      await axios.put(`http://localhost:5000/api/posts/${editingPost.id}`, data, {
        headers: { "x-admin-token": getAdminToken() }
      });
      // Actualiza el post modificado en el estado
      setPosts(posts.map(p => (p.id === editingPost.id ? { ...p, ...data } : p)));
      closeEditModal();
    } catch (error) {
      alert("Error al editar el chollo");
      done && done();
    }
  };

  // Filtrar y ordenar
  const filteredPosts = posts.filter(post => {
    // Categoría
    if (filters.category && post.category_id !== filters.category) return false;

    // Búsqueda texto
    if (
      filters.searchText &&
      !(
        (post.title && post.title.toLowerCase().includes(filters.searchText.toLowerCase())) ||
        (post.content && post.content.toLowerCase().includes(filters.searchText.toLowerCase()))
      )
    ) return false;

    // Precio
    if (filters.priceRange) {
      const price = Number(post.price) || 0;
      switch (filters.priceRange) {
        case 'free':
          if (price > 0) return false;
          break;
        case '0-10':
          if (price < 0 || price > 10) return false;
          break;
        case '10-50':
          if (price < 10 || price > 50) return false;
          break;
        case '50+':
          if (price < 50) return false;
          break;
        default:
          break;
      }
    }

    // Fecha (si quieres agregar filtro por fecha, aquí sería)
    // ...

    return true;
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.created_at) - new Date(a.created_at);
      case 'oldest':
        return new Date(a.created_at) - new Date(b.created_at);
      case 'price-low':
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      case 'price-high':
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      default:
        return 0;
    }
  });

  return (
    <div
      className="relative flex flex-col min-h-screen bg-transparent overflow-x-hidden"
      style={{ overflowY: "hidden" }}
    >
      {/* Decoraciones */}
      <div className="absolute -top-28 -left-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-28 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-300/20 rounded-full blur-xl pointer-events-none" />
      {/* Margen superior */}
      <div className="h-10 md:h-16" />
      {/* Encabezado */}
      <div className="relative z-10 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-blue-800 mb-2 drop-shadow">
          Últimos Chollos
        </h2>
        <p className="text-purple-600 font-medium text-lg mb-6">
          ¡Aprovecha las mejores ofertas del momento!
        </p>
      </div>

      {/* Botón para ir a filtros */}
      <div className="flex justify-center mb-4 space-x-4">
        <button
          onClick={() => window.location.href = "/filtros"}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-600 transition"
        >
          🔍 Buscar y Filtrar
        </button>
        {/* Aquí otro botón si quieres */}
        <button
          onClick={() => window.location.href = "/añadir"}
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          ➕ Añadir Chollo
        </button>
      </div>

      {/* Lista de chollos */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-8 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-pink-400" />
          </div>
        ) : sortedPosts.length === 0 ? (
          <p className="text-center text-gray-500 font-semibold text-xl bg-white/80 rounded-xl py-8 px-4 shadow">
            No hay chollos publicados. ¡Sé el primero en añadir uno!
          </p>
        ) : (
          sortedPosts.slice(0,6).map(post => (
            <div
              key={post.id}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition border border-blue-100 p-6 flex flex-col md:flex-row gap-5 items-start group"
            >
              {/* Contenido */}
              <div className="flex-1">
                <PostCard post={post} />
              </div>
              {/* Botones admin */}
              {adminMode && (
                <div className="flex flex-col justify-start gap-2 md:ml-4 mt-4 md:mt-0 self-start">
                  <button
                    onClick={() => openEditModal(post)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded shadow font-semibold transition"
                    title="Editar chollo"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => openDeleteModal(post.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow font-semibold transition"
                    title="Borrar chollo"
                  >
                    Borrar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
        {/* Ver todos si quieres */}
        {posts.length > 6 && (
          <div className="text-center mt-4">
            <button
              onClick={() => window.location.href = "/todos"}
              className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg transition"
            >
              Ver todos
            </button>
          </div>
        )}
      </div>

      {/* Modales */}
      <ModalConfirm
        isOpen={modalOpen}
        message="¿Seguro que quieres borrar este chollo?"
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />
      <ModalEditPost
        isOpen={modalEditOpen}
        post={editingPost}
        onSave={handleEditSave}
        onCancel={closeEditModal}
      />
    </div>
  );
}

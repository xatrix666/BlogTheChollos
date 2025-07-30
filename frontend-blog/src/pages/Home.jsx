import { useEffect, useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard.jsx";
import ModalConfirm from "../components/ModalConfirm.jsx";
import ModalEditPost from "../components/ModalEditPost.jsx";
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

  const fetchPosts = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/api/posts")
      .then(res => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
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
      setPosts(posts.map(p => (p.id === editingPost.id ? { ...p, ...data } : p)));
      closeEditModal();
    } catch (error) {
      alert("Error al editar el chollo");
      done && done();
    }
  };

  return (
    <div
      className="relative flex flex-col min-h-screen bg-transparent overflow-x-hidden"
      style={{ overflowY: "hidden" }}
    >
      {/* Decoraciones */}
      <div className="absolute -top-28 -left-20 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-28 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-blue-300/20 rounded-full blur-xl pointer-events-none" />
      {/* Margen extra arriba */}
      <div className="h-10 md:h-16" />
      <div className="relative z-10 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-blue-800 mb-2 drop-shadow">
          Últimos Chollos
        </h2>
        <p className="text-purple-600 font-medium text-lg mb-6">
          ¡Aprovecha las mejores ofertas del momento!
        </p>
      </div>
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-8 px-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-pink-400" />
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-gray-500 font-semibold text-xl bg-white/80 rounded-xl py-8 px-4 shadow">
            No hay chollos publicados. ¡Sé el primero en añadir uno!
          </p>
        ) : (
          posts.map(post => (
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
      </div>
      {/* Modal confirmación */}
      <ModalConfirm
        isOpen={modalOpen}
        message="¿Seguro que quieres borrar este chollo?"
        onConfirm={handleDeleteConfirm}
        onCancel={closeDeleteModal}
      />
      {/* Modal edición */}
      <ModalEditPost
        isOpen={modalEditOpen}
        post={editingPost}
        onSave={handleEditSave}
        onCancel={closeEditModal}
      />
    </div>
  );
}

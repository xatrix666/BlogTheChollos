import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import Notification from "./Notification.jsx";

export default function CommentSection({ postId }) {
  const [filter, setFilter] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({
    author_name: "",
    author_email: "",
    content: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [notifColor, setNotifColor] = useState("green");
  
  // Estados para pestañas y colapsar
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("comments"); // "comments" o "add"

  useEffect(() => {
    async function loadFilter() {
      const mod = await import("bad-words");
      const FilterClass = mod.Filter || mod.default || mod;
      const instance = new FilterClass();
      instance.addWords("palabra1", "palabra2");
      setFilter(instance);
    }
    loadFilter();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`/api/posts/${postId}/comments`);
      setComments(Array.isArray(response.data) ? response.data : []);
    } catch {
      setComments([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.author_name.trim() || !newComment.content.trim()) {
      alert("Por favor, completa los campos obligatorios");
      return;
    }
    if (filter && filter.isProfane(newComment.content)) {
      alert("Tu comentario contiene palabras inapropiadas. Por favor, modifícalo.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(`/api/posts/${postId}/comments`, newComment);
      setNewComment({ author_name: "", author_email: "", content: "" });
      await fetchComments();
      setNotification("¡Comentario publicado correctamente!");
      setNotifColor("green");
      setActiveTab("comments"); // Cambiar a ver comentarios después de publicar
    } catch {
      setNotification("Error al publicar comentario");
      setNotifColor("red");
    }
    setIsSubmitting(false);
  };

  return (
    <>
      {/* Notificación fuera del contenedor */}
      {notification && (
        <Notification
          message={notification}
          color={notifColor}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 mt-8 max-w-3xl mx-auto overflow-hidden">
        {/* Header colapsable con contador */}
        <div 
          className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50/50 transition-colors border-b border-gray-100"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">💬</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Comentarios
              </h3>
              <p className="text-sm text-gray-500">
                {comments.length} {comments.length === 1 ? 'comentario' : 'comentarios'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {comments.length > 0 && (
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {comments.length}
              </span>
            )}
            <button className="text-gray-400 hover:text-gray-600 transition-transform duration-200">
              <svg 
                className={`w-6 h-6 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenido expandible */}
        <div className={`transition-all duration-300 overflow-hidden ${
          isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {/* Pestañas */}
          <div className="flex border-b border-gray-200 bg-gray-50/50">
            <button
              onClick={() => setActiveTab("comments")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === "comments"
                  ? "text-blue-600 bg-white border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>📖</span>
                Ver Comentarios
                {comments.length > 0 && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                    {comments.length}
                  </span>
                )}
              </div>
            </button>
            
            <button
              onClick={() => setActiveTab("add")}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === "add"
                  ? "text-green-600 bg-white border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>✍️</span>
                Escribir Comentario
              </div>
            </button>
          </div>

          {/* Contenido de las pestañas */}
          <div className="p-6">
            {activeTab === "comments" && (
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">💭</span>
                    </div>
                    <p className="text-gray-500 text-lg mb-4">No hay comentarios aún</p>
                    <button
                      onClick={() => setActiveTab("add")}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105"
                    >
                      ¡Sé el primero en comentar!
                    </button>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                    {comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5 border-l-4 border-blue-400 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">
                                {comment.author_name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-semibold text-blue-700 text-lg">
                              {comment.author_name}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500 italic">
                            {new Date(comment.created_at).toLocaleString('es-ES', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="text-gray-800 leading-relaxed">
                          <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                            {comment.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "add" && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    ✍️ Comparte tu opinión
                  </h4>
                  <p className="text-gray-600">
                    Tu comentario ayuda a otros usuarios. Sé respetuoso y constructivo.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Tu nombre *"
                        className="w-full border-2 border-gray-300 focus:border-blue-500 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                        value={newComment.author_name}
                        onChange={(e) =>
                          setNewComment({ ...newComment, author_name: e.target.value })
                        }
                        required
                      />
                      <span className="absolute top-4 right-4 text-red-500">*</span>
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Tu email (opcional)"
                        className="w-full border-2 border-gray-300 focus:border-blue-500 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
                        value={newComment.author_email}
                        onChange={(e) =>
                          setNewComment({ ...newComment, author_email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="relative">
                    <textarea
                      placeholder="Escribe tu comentario... (puedes usar Markdown)"
                      className="w-full border-2 border-gray-300 focus:border-blue-500 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all resize-none"
                      rows={6}
                      value={newComment.content}
                      onChange={(e) =>
                        setNewComment({ ...newComment, content: e.target.value })
                      }
                      required
                    />
                    <span className="absolute top-4 right-4 text-red-500">*</span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                    <p className="text-sm text-gray-500">
                      * Campos obligatorios
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-8 py-3 rounded-xl font-semibold transition-all hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Publicando...
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          Publicar Comentario
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

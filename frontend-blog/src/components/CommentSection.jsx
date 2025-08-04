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
  const [notifColor, setNotifColor] = useState("green"); // "green" éxito, "red" error


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

  useEffect(() => {
    console.log("Estado notification:", notification);
  }, [notification]);

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
      fetchComments();
      setNotification("¡Comentario publicado correctamente!");
      setNotifColor("green");
    } catch {
      setNotification("Error al publicar comentario");
      setNotifColor("red");
    }
    setIsSubmitting(false);
  };
  console.log("notificationnnn:", notification);
  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8 max-w-3xl mx-auto">
      {notification && (
        <Notification
          message={notification}
          color={notifColor}
          onClose={() => setNotification(null)}
        />
      )}
      <h3 className="text-2xl font-bold mb-6 text-gray-900">
        Comentarios ({comments.length})
      </h3>
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Tu nombre *"
            className="border-2 border-gray-300 focus:border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={newComment.author_name}
            onChange={(e) =>
              setNewComment({ ...newComment, author_name: e.target.value })
            }
            required
          />
          <input
            type="email"
            placeholder="Tu email (opcional)"
            className="border-2 border-gray-300 focus:border-blue-500 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={newComment.author_email}
            onChange={(e) =>
              setNewComment({ ...newComment, author_email: e.target.value })
            }
          />
        </div>
        <textarea
          placeholder="Escribe tu comentario..."
          className="border-2 border-gray-300 focus:border-blue-500 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
          rows={5}
          value={newComment.content}
          onChange={(e) =>
            setNewComment({ ...newComment, content: e.target.value })
          }
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? "Publicando..." : "Publicar Comentario"}
        </button>
      </form>

      <div className="space-y-6 max-h-[450px] overflow-y-auto">
        {comments.length === 0 && (
          <p className="text-gray-500 italic text-center">No hay comentarios aún.</p>
        )}
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-l-4 border-blue-500 pl-5 py-4 bg-blue-50 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-blue-700 text-lg">
                {comment.author_name}
              </span>
              <span className="text-xs text-gray-500 italic">
                {new Date(comment.created_at).toLocaleString()}
              </span>
            </div>
            <div className="text-gray-800 whitespace-pre-wrap">
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {comment.content}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

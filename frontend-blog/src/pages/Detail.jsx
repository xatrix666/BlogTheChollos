import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Detail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/posts/${id}`)
      .then(res => setPost(res.data));
  }, [id]);

  if (!post) return <div className="text-center py-20">Cargando...</div>;

  return (
    <div className="flex flex-col max-w-xl mx-auto bg-white rounded-2xl shadow p-8 gap-3 mt-6 mb-6">
      <Link to="/" className="text-blue-600 hover:underline mb-2">← Volver</Link>
      {post.image && (
        <img 
          src={post.image} 
          alt={post.title} 
          className="w-full rounded mb-4 max-h-[40vh] object-contain" 
        />
      )}
      <h2 className="text-3xl font-bold mb-2 text-gray-900">{post.title}</h2>
      {post.price && (
        <span className="inline-block px-3 py-1 mb-2 bg-green-200 text-green-700 font-bold rounded">
          💶 {parseFloat(post.price).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
        </span>
      )}
      <p className="text-gray-800 mb-2">{post.content}</p>
      {post.link && (
        <a 
          href={post.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block text-blue-700 underline hover:underline mb-3">
          Ir a la oferta 🔗
        </a>
      )}
      <div className="text-xs text-gray-400 text-right">
        Publicado: {new Date(post.created_at).toLocaleString()}
      </div>
    </div>
  );
}

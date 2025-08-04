import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition 
      border border-blue-100 p-6 flex flex-col md:flex-row gap-5 items-center group">
      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="w-32 h-32 object-cover rounded-xl border border-purple-200 shadow-sm bg-white/60 group-hover:scale-110 transition"
        />
      )}
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-1">
          {post.category_name && (
            <span
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-xs font-semibold"
              style={{ backgroundColor: post.category_color || '#3B82F6' }}
            >
              <span>{post.category_icon}</span>
              {post.category_name}
            </span>
          )}
          <h3 className="text-2xl font-bold text-blue-800 group-hover:text-pink-600 transition flex-1">
            <Link to={`/chollo/${post.id}`} className="hover:underline">
              {post.title}
            </Link>
          </h3>
        </div>
        {post.price && (
          <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-bold mb-1">
            {parseFloat(post.price).toLocaleString("es-ES", { style: "currency", currency: "EUR" })}
          </span>
        )}
        <p className="text-gray-700 mt-2 line-clamp-2">{post.content}</p>
        {post.link && (
          <a
            href={post.link.startsWith('http') ? post.link : `https://${post.link}`}
            className="inline-block mt-3 text-blue-600 font-semibold hover:text-blue-900 underline transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ver oferta 🔗
          </a>
        )}
        <div className="text-xs text-gray-400 text-right mt-1">
          Publicado: {new Date(post.created_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

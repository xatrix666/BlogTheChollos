import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CommentSection from "../components/CommentSection.jsx";
import StarRating from "../components/StarRating.jsx";

export default function Detail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  // Estados para ratings
  const [ratings, setRatings] = useState({ average: 0, total: 0 });
  const [userRating, setUserRating] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    // Cargar post
    axios.get(`http://localhost:5000/api/posts/${id}`)
      .then(res => setPost(res.data))
      .catch(console.error);

    // Cargar estadísticas de ratings
    fetchRatings();

    // Verificar si el usuario ya votó
    checkUserRating();
  }, [id]);

  const fetchRatings = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}/ratings`);
      setRatings(res.data);
    } catch (error) {
      console.error('Error fetching ratings:', error);
    }
  };

  const checkUserRating = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/posts/${id}/ratings/user`);
      setHasVoted(res.data.hasVoted);
      setUserRating(res.data.rating);
    } catch (error) {
      console.error('Error checking user rating:', error);
    }
  };

  const handleRate = async (rating) => {
    try {
      // Optimistic update
      setUserRating(rating);
      
      await axios.post(`http://localhost:5000/api/posts/${id}/ratings`, { rating });
      setHasVoted(true);
      
      // Actualizar estadísticas
      await fetchRatings();
      
      console.log(`¡Valoración de ${rating} estrellas guardada!`);
      
    } catch (error) {
      console.error('Error saving rating:', error);
      // Revertir optimistic update
      setUserRating(null);
      alert('Error al guardar la valoración. Inténtalo de nuevo.');
    }
  };

  const handleChangeVote = () => {
    setHasVoted(false);
    setUserRating(null);
  };

  if (!post) return (
    <div className="text-center py-20">
      <span className="animate-spin inline-block h-10 w-10 border-4 border-blue-400 border-t-transparent rounded-full"></span>
      <p className="mt-4 text-gray-600">Cargando chollo...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10 mt-8 mb-12 flex flex-col gap-6">

      <Link
        to="/"
        className="flex items-center text-blue-600 hover:text-blue-800 font-semibold gap-2 mb-4"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver a inicio
      </Link>

      {/* Categoría */}
      {post.category_name && (
        <span
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-white font-bold text-sm select-none shadow-sm"
          style={{ backgroundColor: post.category_color || '#3B82F6' }}
        >
          <span className="text-lg">{post.category_icon}</span>
          {post.category_name}
        </span>
      )}

      {/* Imagen */}
      {post.image && (
        <div className="overflow-hidden rounded-2xl shadow-lg mb-6">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-72 object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            draggable={false}
          />
        </div>
      )}

      {/* Título */}
      <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-md">
        {post.title}
      </h1>

      {/* SECCIÓN DE RATINGS - MEJORADA */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex flex-col gap-4">
          
          {/* Encabezado */}
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            ⭐ Valoraciones de la comunidad
          </h3>
          
          {/* Rating promedio - más prominente */}
          <div className="flex items-center gap-4 pb-3 border-b border-yellow-200">
            <StarRating value={ratings.average} disabled size="text-3xl" />
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-800">
                {ratings.average > 0 ? ratings.average.toFixed(1) : '—'}
              </span>
              <span className="text-sm text-gray-600">
                {ratings.total} {ratings.total === 1 ? 'valoración' : 'valoraciones'}
              </span>
            </div>
          </div>

          {/* Tu valoración */}
          <div className="flex flex-col gap-3">
            {!hasVoted ? (
              <>
                <p className="text-sm font-semibold text-gray-700">
                  🗳️ ¿Qué te parece esta oferta?
                </p>
                <div className="flex items-center gap-3">
                  <StarRating
                    value={0}
                    onRate={handleRate}
                    disabled={false}
                    size="text-2xl"
                  />
                  <span className="text-sm text-gray-500">Haz clic para valorar</span>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-green-700 flex items-center gap-2">
                  ✅ Tu valoración: {userRating} {userRating === 1 ? 'estrella' : 'estrellas'}
                </p>
                <div className="flex items-center gap-3">
                  <StarRating
                    value={userRating}
                    disabled={true}
                    size="text-xl"
                  />
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-green-600">¡Gracias por votar!</span>
                    <button 
                      onClick={handleChangeVote}
                      className="text-xs text-blue-600 hover:text-blue-800 underline text-left"
                    >
                      Cambiar mi valoración
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Precio */}
      {post.price && (
        <div className="text-2xl font-bold text-green-600 flex items-center gap-2 mb-4">
          <span>💶</span>
          <span>
            {parseFloat(post.price).toLocaleString("es-ES", {
              style: "currency",
              currency: "EUR"
            })}
          </span>
        </div>
      )}

      {/* Contenido */}
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {/* Enlace */}
      {post.link && (
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-md hover:from-blue-600 hover:to-purple-700 transition"
        >
          Visitar oferta 🔗
        </a>
      )}

      {/* Fecha */}
      <div className="text-xs text-gray-400 text-right italic">
        Publicado: {new Date(post.created_at).toLocaleString()}
      </div>

      {/* Comentarios */}
      <div className="mt-8 border-t pt-6">
        <CommentSection postId={id} />
      </div>
    </div>
  );
}

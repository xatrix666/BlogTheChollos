import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PostCard from "../components/PostCard.jsx";
import FilterSystem from "../components/FilterSystem.jsx";

export default function Filters() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  
  // Filtros
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    dateRange: '',
    searchText: '',
    sortBy: 'newest'
  });

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
  }, []);

  // Función para filtrar posts según filtros actuales
  const filteredPosts = posts.filter(post => {
    // Filtrar categoría
    if (filters.category && post.category_id !== filters.category) return false;

    // Filtrar búsqueda texto en título y contenido
    if (
      filters.searchText &&
      !(
        (post.title && post.title.toLowerCase().includes(filters.searchText.toLowerCase())) ||
        (post.content && post.content.toLowerCase().includes(filters.searchText.toLowerCase()))
      )
    ) return false;

    // Filtrar por precio
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

    return true;
  });

  // Ordenar posts filtrados
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
      
      {/* Margen extra arriba */}
      <div className="h-10 md:h-16" />
      
      <div className="relative z-10 mb-10 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-blue-800 mb-2 drop-shadow">
          Buscar y Filtrar Chollos
        </h2>
        <p className="text-purple-600 font-medium text-lg mb-6">
          Encuentra exactamente lo que buscas
        </p>
        
        {/* Botón volver */}
        <button
          onClick={() => navigate('/')}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all hover:scale-105 mb-6"
        >
          ← Volver al Inicio
        </button>
      </div>

      {/* Sistema de filtros */}
      <FilterSystem categories={categories} onFiltersChange={setFilters} />

      {/* Resultados */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col gap-8 px-4">
        {/* Contador de resultados */}
        <div className="text-center bg-white/80 rounded-xl py-3 px-4 shadow">
          <p className="text-gray-700 font-semibold">
            {loading ? 'Cargando...' : `${sortedPosts.length} chollos encontrados`}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <span className="animate-spin rounded-full h-12 w-12 border-4 border-blue-300 border-t-pink-400" />
          </div>
        ) : sortedPosts.length === 0 ? (
          <div className="text-center bg-white/80 rounded-xl py-12 px-4 shadow">
            <p className="text-gray-500 font-semibold text-xl mb-4">
              No se encontraron chollos con esos filtros
            </p>
            <button
              onClick={() => setFilters({
                category: '',
                priceRange: '',
                dateRange: '',
                searchText: '',
                sortBy: 'newest'
              })}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          sortedPosts.map(post => (
            <div
              key={post.id}
              className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-105 transition border border-blue-100 p-6"
            >
              <PostCard post={post} />
            </div>
          ))
        )}
      </div>

      {/* Espacio extra abajo */}
      <div className="h-20" />
    </div>
  );
}

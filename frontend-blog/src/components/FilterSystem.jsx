import { useState } from 'react';

export default function FilterSystem({ onFiltersChange, categories }) {
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    dateRange: '',
    searchText: '',
    sortBy: 'newest'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const priceRanges = [
    { value: '', label: 'Todos los precios' },
    { value: 'free', label: 'Gratis' },
    { value: '0-10', label: 'Menos de 10€' },
    { value: '10-50', label: '10€ - 50€' },
    { value: '50+', label: 'Más de 50€' }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 mb-8">
      <h3 className="text-xl font-bold mb-4 text-gray-900">Filtrar Chollos</h3>
      
      {/* Búsqueda por texto */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar chollos..."
          className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-lg"
          value={filters.searchText}
          onChange={(e) => handleFilterChange('searchText', e.target.value)}
        />
      </div>

      {/* Filtros por categoría */}
      <div className="mb-4">
        <h4 className="font-semibold mb-2">Categorías</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('category', '')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filters.category === '' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => handleFilterChange('category', category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filters.category === category.id 
                  ? 'text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              style={{
                backgroundColor: filters.category === category.id ? category.color : undefined
              }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Filtro por precio */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-semibold mb-2">Precio</label>
          <select
            className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-lg"
            value={filters.priceRange}
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
          >
            {priceRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block font-semibold mb-2">Ordenar por</label>
          <select
            className="w-full border-2 border-gray-200 focus:border-blue-500 p-3 rounded-lg"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="newest">Más recientes</option>
            <option value="oldest">Más antiguos</option>
            <option value="price-low">Precio: menor a mayor</option>
            <option value="price-high">Precio: mayor a menor</option>
          </select>
        </div>
      </div>
    </div>
  );
}
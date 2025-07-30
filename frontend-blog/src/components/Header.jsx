export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 py-6 shadow-xl h-24 flex flex-col justify-center z-50">
      <h1 className="text-4xl font-extrabold text-white text-center tracking-tight drop-shadow-lg select-none">
        BlogTheChollos
      </h1>
      <p className="text-center text-blue-100 opacity-80 text-base mt-1 tracking-wide">
        Descubre ofertas increíbles cada día con estilo.
      </p>
    </header>
  );
}

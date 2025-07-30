import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Detail from "./pages/Detail.jsx";
import AddChollo from "./pages/AddChollo.jsx";

export default function App() {
  return (
    <Router basename="/BlogTheChollos">
      <div className="fixed -top-32 -left-40 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed -bottom-32 -right-40 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <Header />
      <Navbar />

      <main 
        className="max-w-5xl mx-auto px-6 bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl" 
        style={{ paddingTop: "10rem", paddingBottom: "3rem" }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chollo/:id" element={<Detail />} />
          <Route path="/añadir" element={<AddChollo />} />
        </Routes>
      </main>
    </Router>
  );
}


import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Books from "./pages/Books";
import BookDetails from "./pages/BookDetails";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import History from "./pages/History";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const location = useLocation();
  const showNavbar = !["/", "/login", "/signup"].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/books" element={<Books />} />
          <Route path="/books/:id" element={<BookDetails />} />

          {/* User Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/history" element={<History />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* 404 */}
          <Route path="*" element={<h1 className="mt-10 text-center">404 - Not Found</h1>} />
        </Routes>
      </main>
    </>
  );
}

export default App;

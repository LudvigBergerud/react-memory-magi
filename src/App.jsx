import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthProvider";
import LandingPage from "./pages/LandingPage";
import Game from "./pages/Game";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import Footer from "./components/Footer";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar></Navbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/result" element={<Result />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/landingpage" element={<LandingPage />} />
        </Routes>
        <Footer></Footer>
      </Router>
    </AuthProvider>
  );
}

export default App;

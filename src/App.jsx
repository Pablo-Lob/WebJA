import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import Footer from './components/footer/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./pages/admin/Dashboard.jsx";
import ManageContent from "./pages/admin/ManageContent.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import Login from './pages/admin/Login.jsx';
import Loader from './components/loader/Loader.jsx';
import {useConfig} from './context/ConfigContext.jsx';

function KeyboardShortcuts() {
    const navigate = useNavigate();

    useEffect(() => {
        {/* Atajo de teclado para admin Ctrl + Shift + A */}
        const handleKeyPress = (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                navigate('/admin/login');
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [navigate]);

    return null; // No renderiza nada
}

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </>
    );
};

function App () {
    const { loading } = useConfig();

    if (loading) {
        return <Loader />;
    }

    return (
        <Router>
            <div className="App">
                <KeyboardShortcuts />
                <Routes>

                    {/* --- Rutas con navbar y footer --- */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Home />} />
                        {/* Para en un futuro poner otras publicaciones */}
                    </Route>

                    {/* --- Rutas sin navbar ni footer --- */}
                    {/* Rutas de administración */}
                    <Route path="/admin/login" element={<Login />} />

                    <Route path="/admin/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />

                    <Route path="/admin/content" element={
                        <ProtectedRoute>
                            <ManageContent />
                        </ProtectedRoute>
                    } />

                    {/* Ruta 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
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
import {db} from './firebase/firebase-config.js';
import {doc, getDoc} from "firebase/firestore";

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

function App () {
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // Documento de la base de datos donde esta el CMS
                const docRef = doc(db, "siteContent", "generalConfig");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const root = document.documentElement;

                    // Si hay unos colores definidos en la base de datos de firebase se aplican.
                    if (data.colors) {
                        const c = data.colors; // Abreviamos para escribir menos

                        // Dorados
                        if (c.goldPrimary) root.style.setProperty('--gold-primary', c.goldPrimary);
                        if (c.goldSecondary) root.style.setProperty('--gold-secondary', c.goldSecondary);
                        if (c.goldAccent) root.style.setProperty('--gold-accent', c.goldAccent);
                        if (c.goldHover) root.style.setProperty('--gold-hover', c.goldHover);
                        if (c.goldDim) root.style.setProperty('--gold-dim', c.goldDim);

                        // Fondos
                        if (c.bgBlack) root.style.setProperty('--bg-black', c.bgBlack);
                        if (c.bgDark) root.style.setProperty('--bg-dark', c.bgDark);
                        if (c.bgSecondary) root.style.setProperty('--bg-secondary', c.bgSecondary);
                        if (c.bgCard) root.style.setProperty('--bg-card', c.bgCard);
                        if (c.bgInput) root.style.setProperty('--bg-input', c.bgInput);

                        // Textos
                        if (c.textWhite) root.style.setProperty('--text-white', c.textWhite);
                        if (c.textGray) root.style.setProperty('--text-gray', c.textGray);
                        if (c.textLightGray) root.style.setProperty('--text-light-gray', c.textLightGray);
                        if (c.textDark) root.style.setProperty('--text-dark', c.textDark);
                        if (c.textButton) root.style.setProperty('--text-button', c.textButton);
                    }
                }
            } catch (error) {
                console.error("Error al cargar la configuracion:", error);
            }
        };
            fetchConfig();
    }, []);
    return (
        <Router>
            <div className="App">
                <KeyboardShortcuts />
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />

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
                <Footer />
            </div>
        </Router>
    );
}

export default App;
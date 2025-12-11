import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import Footer from './components/footer/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./pages/admin/Dashboard.jsx";
import ManageContent from "./pages/admin/ManageContent.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Login from './pages/admin/Login.jsx';
import Loader from './components/loader/Loader.jsx';
import {useConfig} from './context/ConfigContext.jsx';
import CookieConsent from "react-cookie-consent";
import {Link} from "react-router-dom";
import LegalPage from "./pages/LegalPage.jsx";

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

    return null;
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

    const [showLoader, setShowLoader] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        if (!loading) {
            setFadeOut(true);

            const timer = setTimeout(() => {
                setShowLoader(false);
            }, 800);

            return () => clearTimeout(timer);
        }
    }, [loading]);

    return (
        <>
            {/* El Loader se renderiza encima de todo. Si showLoader es false, se elimina del DOM */}
            {showLoader && <Loader fadeOut={fadeOut} />}

            <Router>
                <div className="App">
                    <KeyboardShortcuts />
                    <Routes>
                        <Route element={<PublicLayout />}>
                            <Route path="/" element={<Home />} />
                        </Route>

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

                        <Route path="/legalpage" element = {<LegalPage />} />
                        <Route path="*" element={<NotFound />} />

                    </Routes>

                    <CookieConsent
                        location="bottom"
                        buttonText="Aceptar"
                        enableDeclineButton
                        declineButtonText="Rechazar"
                        cookieName="its-stones-consent"
                        style={{
                            background: "#0f0f0f",
                            borderTop: "1px solid #d4af37",
                            alignItems: "center",
                            zIndex: 9990 /* Alto, pero por debajo del Loader (9999) */
                        }}
                        buttonStyle={{
                            background: "#d4af37",
                            color: "#000",
                            fontSize: "14px",
                            fontWeight: "bold",
                            borderRadius: "4px",
                            padding: "10px 20px"
                        }}
                        declineButtonStyle={{
                            background: "transparent",
                            border: "1px solid #d4af37",
                            color: "#d4af37",
                            fontSize: "14px",
                            borderRadius: "4px",
                            padding: "10px 20px"
                        }}
                        expires={150}
                    >
                        Valoramos su privacidad. Usamos cookies para mejorar su experiencia y analizar el tráfico conforme a la normativa internacional.{" "}
                        <Link to="/cookies-policy" style={{ color: "#f7e695", textDecoration: "underline", marginLeft: "5px" }}>
                            Leer Política de Cookies
                        </Link>
                    </CookieConsent>
                </div>
            </Router>
        </>
    );
}

export default App;
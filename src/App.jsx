import {BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import Navbar from './components/navbar/Navbar.jsx';
import Footer from './components/footer/Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dashboard from "./pages/admin/dashboard/Dashboard.jsx";
import ManageContent from "./pages/admin/manage/ManageContent.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import Login from './pages/admin/login/Login.jsx';
import Loader from './components/loader/Loader.jsx';
import {useConfig} from './context/ConfigContext.jsx';
import LegalPage from './pages/LegalPage.jsx';
import Catalog from "./pages/Catalog.jsx";
import ManageCatalog from "./pages/admin/manage/ManageCatalog.jsx";
import ManageBranches from "./pages/admin/manage/ManageBranches.jsx";
import ManageServices from "./pages/admin/manage/ManageServices.jsx";
import ManageAdmins from "./pages/admin/manage/ManageAdmins.jsx";
import ChangePassword from "./pages/admin/ChangePassword.jsx";
import CookieConsent from "./components/cookieConsent/CookieConsent.jsx";
import ManageLanding from "./pages/admin/manage/ManageLanding.jsx";
import ManageHero from "./pages/admin/manage/ManageHero.jsx";
import ManageAbout from "./pages/admin/manage/ManageAbout.jsx";
import ManageMission from "./pages/admin/manage/ManageMission.jsx";
import ManageBlog from "./pages/admin/manage/ManageBlog.jsx";
import Blog from "./pages/Blog.jsx";

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
            <CookieConsent/>
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
                            {/* Páginas legales */}
                            <Route path="/privacy-policy" element={<LegalPage id="privacy" title="Politica de Privacidad" />} />
                            <Route path="/terms-policy" element={<LegalPage id="terms" title="Terminos y Condiciones" />} />
                            <Route path="/cookie-policy" element={<LegalPage id="cookies" title="Politica de Cookies" />} />
                            {/* Catalogo */}
                            <Route path="/catalog" element={<Catalog />} />
                            {/* Blog */}
                            <Route path="/blog" element={<Blog />} />
                        </Route>

                        <Route path="/admin/login" element={<Login />} />

                        <Route path="/admin/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/dashboard/landing-page" element={
                            <ProtectedRoute>
                                <ManageLanding />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/content" element={
                            <ProtectedRoute>
                                <ManageContent />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/catalog" element={
                            <ProtectedRoute>
                                <ManageCatalog />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/change-password" element={
                            <ProtectedRoute>
                                <ChangePassword />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/users" element={
                            <ProtectedRoute>
                                <ManageAdmins/>
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/hero" element={
                            <ProtectedRoute>
                                <ManageHero/>
                            </ProtectedRoute>
                        }  />

                        <Route path="/admin/about-us" element={
                            <ProtectedRoute>
                                <ManageAbout />
                            </ProtectedRoute>
                        }  />

                        <Route path="/admin/missions" element={
                            <ProtectedRoute>
                                <ManageMission/>
                            </ProtectedRoute>
                        }  />

                        <Route path="/admin/branches" element={
                            <ProtectedRoute>
                                <ManageBranches />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/services" element={
                            <ProtectedRoute>
                                <ManageServices />
                            </ProtectedRoute>
                        } />

                        <Route path="/admin/blog" element={
                            <ProtectedRoute>
                                <ManageBlog/>
                            </ProtectedRoute>
                        } />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;
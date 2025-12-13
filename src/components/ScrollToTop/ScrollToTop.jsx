import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    // Extraemos tanto la ruta (pathname) como el hash (#seccion)
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // Si tiene # como seguramente sea un componente no hace scroll
        if (hash) {
            return
        }
        else { // Si no tiene hash, hacemos scroll al top
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]); // Se ejecuta cuando cambia la ruta O el hash

    return null;
};

export default ScrollToTop;
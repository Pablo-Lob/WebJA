import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // CASO 1: Navegación a una sección (ej: /#contact)
        if (hash) {
            // Esperamos un "tick" para asegurar que la página nueva se ha renderizado
            setTimeout(() => {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100); // 100ms es suficiente para esperar al renderizado sin que el usuario lo note
        }
        // CASO 2: Navegación normal (ej: ir a Política de Cookies)
        else {
            window.scrollTo(0, 0);
        }
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
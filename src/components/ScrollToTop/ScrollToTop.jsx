import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();
    const prevPathname = useRef(pathname);

    useEffect(() => {
        // Solo scroll to top cuando cambia el pathname (no el hash)
        if (prevPathname.current !== pathname) {
            window.scrollTo(0, 0);
            prevPathname.current = pathname;
        }
    }, [pathname]);

    return null;
};

export default ScrollToTop;
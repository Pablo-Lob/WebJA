import React from 'react';
import './ShineButton.css';
import { Link, useNavigate } from 'react-router-dom';

function ShineButton({ href = '#', children, ...rest }) {
    const navigate = useNavigate();
    const isInternal = typeof href === 'string' && href.startsWith('/');
    const hasHash = typeof href === 'string' && href.includes('#');

    const handleClick = (e) => {
        if (isInternal && hasHash) {
            const [pathPart, hashPart] = href.split('#');
            const targetPath = pathPart || '/';
            const id = hashPart;

            // Si la ruta objetivo es la misma que la actual (o solo '#id'), hacemos scroll suave
            if (targetPath === '/' || targetPath === window.location.pathname) {
                e.preventDefault();
                const el = document.getElementById(id);
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                } else {
                    // fallback: navegar si el id no está en la página actual
                    navigate(href);
                }
                return;
            }

            // Si la ruta es distinta, navegamos a ella
            e.preventDefault();
            navigate(href);
        }
    };

    const Component = isInternal ? Link : 'a';
    const props = isInternal ? { to: href } : { href };

    return (
        <Component className="shine-btn" {...props} onClick={handleClick} {...rest}>
            {children}
        </Component>
    );
}

export default ShineButton;
import React from 'react';
import '../styles/NotFound.css';
import {Link} from 'react-router-dom';

function NotFound() {
    return (
        <div className="not-found">
            <h1>404 - Page Not Found</h1>
            <p>
                The page you are looking for does not exist. Please check the URL or return to the home page.
            </p>
            <Link to="/">
                Volver al Inicio
            </Link>
        </div>
    );
}
export default NotFound;
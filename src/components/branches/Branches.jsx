import React, { useState, useEffect } from 'react';
import './Branches.css';
import {useConfig} from '../../context/ConfigContext.jsx';

const Branches = () => {
    const [branchesData, setBranchesData] = useState([]);

    const { config } = useConfig();

    const getValue = (key, defaultValue) => {
        return config?.find(item => item.key === key)?.value || defaultValue;
    }

    // URL API (Modo lectura)
    const API_URL = 'https://itsstonesfzco.com/api.php?table=branches';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    setBranchesData(data);
                }
            } catch (error) {
                console.error("Error cargando sedes:", error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="branches-container">
            <div className="branches-header">
                <h2>{getValue('branches_title', 'Our Global Presence')}</h2>
                <div className="gold-divider-small"></div>
                <p>{getValue('branches_subtitle', 'Strategically located to serve the world\'s major markets.')}</p>
            </div>

            <div className="branches-grid">
                {branchesData.map((branch) => (
                    <div key={branch.id} className="branch-card">
                        <div className="branch-image-wrapper">
                            <img src={branch.image} alt={branch.city} />
                            {/* Overlay vacío para efectos visuales si se desea */}
                            <div className="branch-overlay"></div>
                        </div>

                        <div className="branch-content">
                            <h3>{branch.city}</h3>
                            <div className="gold-line"></div>
                            <p className="branch-desc">{branch.description}</p>

                            <div className="branch-footer">
                                <p className="branch-details">{branch.details}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Branches;
import React, { useState, useEffect } from "react";
import './Services.css';

const Services = () => {
    const [servicesData, setServiceData] = useState([]);

    const API_URL = 'https://itsstonesfzco.com/api.php?table=services';

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    setServiceData(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Error cargando servicios: ", error);
            }
        };
        fetchData();
    }, []);

    return (
        <section id="services" className="services-section">
            {servicesData.length > 0 ? (
                servicesData.map((service) => (
                    <div key={service.id} className="service-card">
                        <div className="service-header">
                            <h2>{service.title}</h2>
                        </div>

                        <div className="services-img">
                            <img src={service.image} alt={service.title} />
                        </div>

                        <div className="services-content">
                            <p>{service.description}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>Cargando servicios...</p>
            )}
        </section>
    );
};

export default Services;
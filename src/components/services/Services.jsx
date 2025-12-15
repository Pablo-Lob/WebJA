import React from 'react';
import './Services.css';
import config from "bootstrap/js/src/util/config.js";
import servicesImg from "../../assets/services.webp";

const Services = () => {
    return (
        <section id="services" className="services-section">
            <div className="services-container">
                <h2>Excellence in Gold & Gems in Importation</h2>
                <div className="gold-divider-center"></div>

                <div className="services-text-block">
                    <img
                        src={config.images?.services || servicesImg}
                        alt="jett"
                        className="services-image"
                    />
                    <p>
                        We view ourselves not merely as importers, but as custodians of value, committed to delivering assets that embody both timeless beauty and tangible investment quality for our distinguished clientele.
                    </p>
                    <p>
                        Beyond acquisition, our service excellence is defined by a seamless and secure logistical framework tailored to the unique needs of the international market. We navigate the complexities of global trade and customs with absolute precision, ensuring that every consignment is managed with the utmost confidentiality, compliance, and security from origin to destination. By combining deep market expertise with a personalized client-centric approach, ITS STONES FZCO provides a bespoke importation experience that guarantees peace of mind, allowing you to expand your portfolio with confidence and ease.

                    </p>
                </div>
            </div>
        </section>
    );
};

export default Services;
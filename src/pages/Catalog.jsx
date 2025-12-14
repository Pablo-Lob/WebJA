import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { X } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './styles/Catalog.css';

const Catalog = () => {
    const [minerals, setMinerals] = useState([]);
    const [selectedMineral, setSelectedMineral] = useState(null);

    // URL de tu API
    const API_URL = 'https://itsstonesfzco.com/catalog-api.php';

    useEffect(() => {
        const fetchMinerals = async () => {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    setMinerals(data);
                }
            } catch (error) {
                console.error("Error cargando catálogo:", error);
            }
        };
        fetchMinerals();
    }, []);

    useEffect(() => {
        if (selectedMineral) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }, [selectedMineral]);

    return (
        <div className="catalog-page">
            <meta name="robots" content="noindex" />

            <div className="catalog-hero">
                <h1>Exclusive Mineral Collection</h1>
                <p>Private Selection for Distinguished Clients</p>
                <div className="gold-divider-center"></div>
            </div>

            <div className="catalog-grid">
                {minerals.map((mineral) => (
                    <div
                        key={mineral.id}
                        className="mineral-card"
                        onClick={() => setSelectedMineral(mineral)}
                    >
                        <div className="card-image-wrapper">
                            {/* Primera imagen como portada */}
                            <img src={mineral.images[0]} alt={mineral.name} />
                            <div className="card-overlay">
                                <span>View Details</span>
                            </div>
                        </div>
                        <div className="card-footer">
                            <h3>{mineral.name}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL (Igual que antes pero adaptado a datos de PHP) */}
            {selectedMineral && (
                <div className="modal-backdrop" onClick={() => setSelectedMineral(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedMineral(null)}>
                            <X size={30} />
                        </button>

                        <div className="modal-layout">
                            <div className="modal-slider">
                                <Swiper
                                    modules={[Navigation, Pagination]}
                                    spaceBetween={10}
                                    slidesPerView={1}
                                    navigation
                                    pagination={{ clickable: true }}
                                    className="mineral-swiper"
                                >
                                    {selectedMineral.images.map((img, index) => (
                                        <SwiperSlide key={index}>
                                            <div className="slide-image-container">
                                                <img src={img} alt={`${selectedMineral.name} view ${index + 1}`} />
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>

                            <div className="modal-info">
                                <h2>{selectedMineral.name}</h2>
                                <div className="gold-divider-left"></div>
                                <div className="description-scroll">
                                    <p>{selectedMineral.description}</p>
                                </div>
                                <a
                                    href={`mailto:info@itsstonesfzco.com?subject=Inquiry about ${selectedMineral.name}`}
                                    className="inquire-btn"
                                >
                                    Inquire Interest
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Catalog;
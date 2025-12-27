import React from 'react';
import './Mission.css';
import defaultMissionImg from '../../assets/ourMission.webp';
import { useConfig } from '../../context/ConfigContext.jsx'; // Importamos hook

const Mission = () => {
    const { config } = useConfig();

    const getValue = (key, defaultValue) => {
        return config?.find(item => item.key === key)?.value || defaultValue;
    };

    return (
        <section className="our-mission-section">
            <div className="our-mission-container">
                <h2 className="our-mission-title">
                    {getValue('mission_title', 'Our Mission')}
                </h2>

                <div className="our-mission-top-content">
                    <div className="our-mission-text-block">
                        <p>
                            {getValue('mission_text_top', 'To be the most trusted and efficient global partner in the sourcing and supply of precious metals and gems from Africa and South America. We commit to maintaining an ethical, transparent, and fully traceable supply chain, creating superior value for our clients while fostering sustainable development in our communities of origin.')}
                        </p>
                    </div>

                    <div className="our-mission-image-container">
                        <img
                            src={getValue('mission_image', defaultMissionImg)}
                            alt="Misión ITS Stones"
                            className="our-mission-image"
                        />
                    </div>
                </div>

                <div className="our-mission-bottom-text">
                    <p>
                        {getValue('mission_text_bottom', 'To be recognized globally as the benchmark for integrity and excellence in natural resource trading, defining the future of the industry through meticulous standards, unwavering compliance, and a commitment to setting new levels of client trust.')}
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Mission;
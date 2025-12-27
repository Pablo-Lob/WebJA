import React, { createContext, useState, useEffect } from 'react';

const ConfigContext = createContext(null);

export const ConfigProvider = ({ children }) => {

    const API_URL = 'https://itsstonesfzco.com/api.php?table=siteConfig';

    const [configData, setConfigData ] = useState([]);
    const [loading, setLoading] = useState(true);

    const [texts, setTexts] = useState( {
        legal: {
            privacy: "",
            terms: "",
            cookies: ""
        }
    });

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const response = await fetch(API_URL);
                if (response.ok) {
                    const data = await response.json();
                    setConfigData(data);

                    const newTexts = {
                        legal: {
                            privacy: data.find(item => item.key === 'privacy_policy')?.value || "<p>Contenido no disponible. </p>",
                            terms: data.find(item => item.key === 'terms_of_service')?.value || "<p>Contenido no disponible. </p>",
                            cookies: data.find(item => item.key === 'cookie_policy')?.value || "<p>Contenido no disponible.</p>"
                        }
                    };
                    setTexts(newTexts);
                }
            } catch (error) {
                console.error("Error cargando base de datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config: configData, texts, loading }}>
            {children}
        </ConfigContext.Provider>
    );
};
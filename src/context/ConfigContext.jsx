import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

const ConfigContext = createContext(null);

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        colors: {},
        images: {}
    });
    const [texts, setTexts] = useState({
        legal: {
            privacy: "<p>Contenido no disponible. </p>",
            terms: "<p>Contenido no disponible. </p>",
            cookies: "<p>Contenido no disponible.</p>"
        }
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                // 1. Configuracion visual
                const docRef = doc(db, "siteContent", "generalConfig");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap. data();
                    setConfig({
                        colors: data. colors || {},
                        images: data. images || {}
                    });

                    // Favicon dinamico
                    if (data.images?. logo) {
                        const link = document.querySelector("link[rel~='icon']");
                        if (link) {
                            link.href = data.images.logo;
                        }
                    }

                    // Aplicar colores CSS
                    if (data.colors) {
                        const root = document.documentElement;
                        const mapping = {
                            goldPrimary: '--gold-primary',
                            goldSecondary: '--gold-secondary',
                            goldAccent: '--gold-accent',
                            goldHover:  '--gold-hover',
                            goldDim: '--gold-dim',
                            bgBlack: '--bg-black',
                            bgDark: '--bg-dark',
                            bgSecondary: '--bg-secondary',
                            bgCard:  '--bg-card',
                            bgInput: '--bg-input',
                            textWhite: '--text-white',
                            textGray:  '--text-gray',
                            textLightGray: '--text-light-gray',
                            textDark: '--text-dark',
                            textButton: '--text-button'
                        };

                        Object.entries(data.colors).forEach(([key, value]) => {
                            if (mapping[key]) {
                                root.style. setProperty(mapping[key], String(value));
                            }
                        });
                    }
                }

                // 2. Textos legales
                const legalRef = doc(db, "siteContent", "legalContent");
                const legalSnap = await getDoc(legalRef);

                if (legalSnap.exists()) {
                    const legalData = legalSnap.data();
                    setTexts({
                        legal: {
                            privacy: legalData.privacy || "<p>Contenido no disponible. </p>",
                            terms: legalData.terms || "<p>Contenido no disponible.</p>",
                            cookies: legalData.cookies || "<p>Contenido no disponible.</p>"
                        }
                    });
                }

            } catch (error) {
                console.error("Error cargando configuracion:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, texts, loading }}>
            {children}
        </ConfigContext.Provider>
    );
};
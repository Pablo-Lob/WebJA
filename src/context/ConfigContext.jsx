import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({
        colors: {},
        images: {}
    });
    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            const docRef = doc(db, "siteContent", "generalConfig");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setConfig(data);

                // Actualización del logo favicon dinamica
                if (data.images?.logo) {
                    const link = document.querySelector("link[rel~='icon']");
                    if (link) {
                        link.href = data.images.logo;
                    } else {
                        // Si no existe, lo creamos (seguridad)
                        const newLink = document.createElement('link');
                        newLink.rel = 'icon';
                        newLink.href = data.images.logo;
                        document.head.appendChild(newLink);
                    }
                }

                // Aplicar colores al CSS automáticamente
                const root = document.documentElement;
                if (data.colors) {
                    // Mapeo de los nombres de variables a CSS variables
                    const mapping = {
                        goldPrimary: '--gold-primary',
                        goldSecondary: '--gold-secondary',
                        goldAccent: '--gold-accent',
                        goldHover: '--gold-hover',
                        goldDim: '--gold-dim',
                        bgBlack: '--bg-black',
                        bgDark: '--bg-dark',
                        bgSecondary: '--bg-secondary',
                        bgCard: '--bg-card',
                        bgInput: '--bg-input',
                        textWhite: '--text-white',
                        textGray: '--text-gray',
                        textLightGray: '--text-light-gray',
                        textDark: '--text-dark',
                        textButton: '--text-button'
                    };

                    Object.entries(data.colors).forEach(([key, value]) => {
                        if (mapping[key]) {
                            root.style.setProperty(mapping[key], value);
                        }
                    });
                }
            }
        } catch (error) {
            console.error("Error cargando configuración:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, loading, refreshConfig: fetchConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};
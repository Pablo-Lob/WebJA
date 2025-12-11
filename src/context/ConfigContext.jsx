import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';

const ConfigContext = createContext();

export const useConfig = () => useContext(ConfigContext);

// --- TEXTOS POR DEFECTO (Fallback) ---
// Esto se usa si Firebase está vacío o cargando
const defaultTexts = {
    hero: {
        title: "ITS-STONES",
        subtitle: "Precious Metals & Gems Import",
        desc: "Discover the difference of trading with integrity and excellence.",
        buttonText: "Contact us"
    },
    about: {
        title: "About Us",
        subtitle: "Forging Trust and Excellence",
        text1: "Headquartered in the strategic hub of Dubai...",
        text2: "We are the dedicated intermediary..."
    },
    services: {
        title: "Excellence in Gold & Gems Importation",
        text1: "We view ourselves not merely as importers...",
        text2: "Beyond acquisition, our service excellence..."
    },
    mission: {
        title: "Our Mission",
        text1: "To be the most trusted and efficient global partner...",
        text2: "To be recognized globally as the benchmark..."
    },
    footer: {
        address: "5WA 328-Third Floor-5 West A Dubai U.A.E",
        phone: "+971 504 272 232",
        email: "info@its-stones.com",
        copyright: "© 2025 ITS-Stones. All rights reserved."
    },
    legal: {
        privacy: "<p>Política de privacidad...</p>",
        terms: "<p>Términos de uso...</p>",
        cookies: "<p>Política de cookies...</p>"
    }
};

export const ConfigProvider = ({ children }) => {
    const [config, setConfig] = useState({ colors: {}, images: {} });

    // Unificamos todos los textos en un estado
    const [texts, setTexts] = useState(defaultTexts);

    const [loading, setLoading] = useState(true);

    const fetchConfig = async () => {
        try {
            // 1. Configuración Visual (Colores/Imágenes)
            const configRef = doc(db, "siteContent", "generalConfig");
            const configSnap = await getDoc(configRef);
            if (configSnap.exists()) {
                const data = configSnap.data();
                setConfig(data);

                // Inyectar CSS Variables
                if (data.colors) {
                    const root = document.documentElement;
                    // ... (Aquí va tu mapeo de colores anterior) ...
                    // Para ahorrar espacio, asumo que mantienes el mapeo que ya tenías
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
                        if (mapping[key]) root.style.setProperty(mapping[key], value);
                    });
                }
                // Favicon
                if (data.images?.logo) {
                    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
                    link.rel = 'icon';
                    link.href = data.images.logo;
                    document.head.appendChild(link);
                }
            }

            // 2. Textos Generales
            const textRef = doc(db, "siteContent", "textContent");
            const textSnap = await getDoc(textRef);

            // 3. Textos Legales
            const legalRef = doc(db, "siteContent", "legalContent");
            const legalSnap = await getDoc(legalRef);

            // Fusionamos todo con los defaults para evitar errores undefined
            setTexts(prev => ({
                ...prev,
                ...(textSnap.exists() ? textSnap.data() : {}),
                legal: { ...prev.legal, ...(legalSnap.exists() ? legalSnap.data() : {}) }
            }));

        } catch (error) {
            console.error("Error config:", error);
        } finally {
            setTimeout(() => setLoading(false), 500);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return (
        <ConfigContext.Provider value={{ config, texts, loading, refreshConfig: fetchConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};
import React, { useRef } from "react";
import "./Carrusel.css";


// Puedes reemplazar/expandir este array con tus propios slides
const slides = [
    {
        image: "/carrusel/carrusel1.jpg",
        name: "Esmeralda 322Kg",
        des: "Una pieza de categoría museo, única en el mercado internacional. Extraída de nuestras minas en Brasil, esta esmeralda monumental representa la máxima seguridad como activo de inversión y garantía financiera para operaciones de gran volumen.",
        route: "/carrusel"
    },
    {
        image: "/carrusel/carrusel2.jpg",
        name: "Rubí 340Kg",
        des: "Fuerza bruta de la naturaleza. Un espécimen de corindón masivo de 340 kilogramos. Su rareza y volumen lo convierten en un activo tangible excepcional para diversificación de patrimonio.",
        route: "/carrusel"
    },
    {
        image: "/carrusel/carrusel3.jpg",
        name: "Amatista",
        des: "Cuarzo violeta de alta pureza. Ideal para talla, lapidación o decoración de gran escala. Suministro constante garantizado.",
        route: "/carrusel"
    },
    {
        image: "/carrusel/carrusel4.jpg",
        name: "Esmeralda de 405Kg",
        des: "Espécimen masivo no es solo una rareza geológica, es un vehículo de inversión. Su volumen y características lo posicionan como una garantía física excepcional (aval) para operaciones financieras complejas o diversificación de patrimonio corporativo.",
        route: "/carrusel"
    },
    {
        image: "/carrusel/carrusel5.jpg",
        name: "Esmeralda de 405Kg",
        des: "",
        route: "/carrusel"
    },
    {
        image: "/carrusel/carrusel6.jpg",
        name: "Esmeralda de 405Kg",
        des: "",
        route: "/carrusel"
    },
];

export default function Carrusel() {
    const slideRef = useRef();

    const handleNext = () => {
        const node = slideRef.current;
        if (!node) return;
        const items = node.querySelectorAll(".item");
        if (items.length > 0) {
            node.appendChild(items[0]);
        }
    };

    const handlePrev = () => {
        const node = slideRef.current;
        if (!node) return;
        const items = node.querySelectorAll(".item");
        if (items.length > 0) {
            node.prepend(items[items.length - 1]);
        }
    };

    return (
        <div className="carrusel-container">
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
            />
            <div className="carrusel-container-inside">
                <div className="slide" ref={slideRef}>
                    {slides.map((slide, idx) => (
                        <div
                            className="item"
                            key={idx}
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            <div className="content">
                                <div className="name">{slide.name}</div>
                                <div className="des">{slide.des}</div>
                                <button>Más minerales</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="button">
                    <button className="prev" onClick={handlePrev}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <button className="next" onClick={handleNext}>
                        <i className="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}
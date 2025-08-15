import React, { useRef } from "react";
import "./Carrusel.css";

// Puedes reemplazar/expandir este array con tus propios slides
const slides = [
    {
        image: "https://i.ibb.co/qCkd9jS/img1.jpg",
        name: "Switzerland",
        des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    },
    {
        image: "https://i.ibb.co/jrRb11q/img2.jpg",
        name: "Finland",
        des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    },
    {
        image: "https://i.ibb.co/NSwVv8D/img3.jpg",
        name: "Iceland",
        des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    },
    {
        image: "https://i.ibb.co/Bq4Q0M8/img4.jpg",
        name: "Australia",
        des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    },
    {
        image: "https://i.ibb.co/jTQfmTq/img5.jpg",
        name: "Netherland",
        des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
    },
    {
        image: "https://i.ibb.co/RNkk6L0/img6.jpg",
        name: "Ireland",
        des: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!",
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
                                <button>See More</button>
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
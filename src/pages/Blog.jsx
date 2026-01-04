import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Blog.css';

const Blog = () => {
    const navigate = useNavigate();

    // Datos simulados (Mock data)
    const [posts] = useState([
        {
            id: 1,
            title: "Revolución de Interfaces 2026",
            excerpt: "Las interfaces cerebro-computadora están cambiando la forma en que interactuamos con la web.",
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=500",
            slug: "revolucion-interfaces",
            date: "04 Ene, 2026",
            category: "Innovación"
        },
        {
            id: 2,
            title: "Ciberseguridad Zero-Trust",
            excerpt: "Por qué el modelo de confianza cero es el estándar absoluto en la nueva era digital.",
            image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=500",
            slug: "ciberseguridad-zero-trust",
            date: "02 Ene, 2026",
            category: "Seguridad"
        },
        {
            id: 3,
            title: "React 19: El Salto Cuántico",
            excerpt: "Analizamos el compilador automático y el manejo nativo de metadatos.",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=500",
            slug: "react-19-analisis",
            date: "28 Dic, 2025",
            category: "Dev"
        }
    ]);

    return (
        <>
            {/* --- SEO NATIVO REACT 19 --- */}
            {/* React 19 elevará esto automáticamente al <head> */}
            <title>Blog Oficial | Noticias Tech y Futuro</title>
            <meta name="description" content="Explora el futuro de la tecnología en nuestro blog. Artículos sobre IA, Ciberseguridad y Desarrollo con React 19." />
            <meta name="keywords" content="Tecnología, React 19, IA, Futuro, Blog, Innovación" />
            <meta property="og:title" content="Blog Oficial | Noticias Tech y Futuro" />
            <meta property="og:description" content="Últimas noticias y artículos sobre tecnología avanzada." />

            <div className="blog-container">
                <div className="blog-hero">
                    <div className="glitch-wrapper">
                        <h1 className="blog-title" data-text="TRANSMISIONES">TRANSMISIONES</h1>
                    </div>
                    <p className="blog-subtitle">Bitácora de exploración tecnológica</p>
                </div>

                <div className="blog-grid">
                    {posts.map((post) => (
                        <article key={post.id} className="tech-card" onClick={() => navigate(`/blog/${post.slug}`)}>
                            <div className="card-media">
                                <img src={post.image} alt={post.title} loading="lazy" />
                                <div className="category-tag">{post.category}</div>
                            </div>
                            <div className="card-body">
                                <div className="meta-info">
                                    <span className="icon">📅</span> {post.date}
                                </div>
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className="card-footer">
                                    <span className="read-action">LEER_DATOS &gt;&gt;</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Blog;
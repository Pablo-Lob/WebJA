import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Blog.css';

const Blog = () => {
    const navigate = useNavigate();

    // Mock data translated to English
    const [posts] = useState([

    ]);

    return (
        <>
            <title>Blog | Its Stones - Industry News</title>
            <meta name="description" content="News about mineral exports, marble, granite, and architectural trends." />

            <div className="blog-container">
                <div className="blog-hero">
                    <h1 className="blog-title">News & Insights</h1>
                    <p className="blog-subtitle">Updates from the world of natural stone</p>
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
                                    <span>{post.date}</span>
                                </div>
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className="card-footer">
                                    <span className="read-action">Read Article &rarr;</span>
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
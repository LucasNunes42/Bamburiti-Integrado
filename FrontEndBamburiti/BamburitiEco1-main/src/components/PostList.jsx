import React, { useEffect, useState } from 'react';
import './PostList.css';
import { Link } from 'react-router-dom';

const PostList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // Busca os posts salvos no seu banco de dados
        fetch('http://localhost:8080/api/posts')
            .then(res => res.json())
            .then(data => setPosts(data))
            .catch(err => console.error("Erro ao carregar posts", err));
    }, []);

    return (
        <div className="bamburiti-posts-section">
            <h2 className="bamburiti-posts-title">Blog Bamburiti</h2>
            <div className="bamburiti-posts-grid">
                {posts.map((post) => (
                    <div className="bamburiti-post-card" key={post.id}>
                        <div className="bamburiti-card-image-wrapper">
                            <img
                                src={`http://localhost:8080${post.urlImagem}`}
                                alt={post.titulo}
                                className="bamburiti-card-img"
                            />
                        </div>
                        <div className="bamburiti-card-content">
                            <Link to={`/blog/${post.id}`} style={{ textDecoration: 'none' }}>
                            <h3 className="bamburiti-card-title">{post.titulo}</h3>
                            </Link>
                            <p className="bamburiti-card-description">{post.conteudo.substring(0, 100)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PostList;
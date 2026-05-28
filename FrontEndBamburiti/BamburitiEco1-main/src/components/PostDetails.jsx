import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './PostDetails.css'; 

const PostDetails = () => {
  const { id } = useParams(); 
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/posts`)
      .then((res) => res.json())
      .then((data) => {
        const encontrado = data.find((item) => item.id === parseInt(id));
        setPost(encontrado);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Carregando artigo...</div>;
  if (!post) return <div style={{ textAlign: 'center', padding: '100px' }}>Post não encontrado.</div>;

  return (
    <div className="post-details-page">
      <article className="post-details-container">
        
        <Link to="/blog" className="post-back-link">← Voltar para o Blog</Link>
        
        <h1 className="post-details-title">{post.titulo}</h1>
        
        <div className="post-details-meta">
          Por <strong>{post.autor}</strong> em {new Date(post.dataPublicacao).toLocaleDateString('pt-BR')}
        </div>

        <img 
          src={`http://localhost:8080${post.urlImagem}`} 
          alt={post.titulo} 
          className="post-details-img"
        />

        <div className="post-details-content">
          {post.conteudo}
        </div>
        
      </article>
    </div>
  );
};

export default PostDetails;
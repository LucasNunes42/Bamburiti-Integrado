import React, { useState } from 'react';
import './CreatePost.css';

const CreatePost = () => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState('Equipe Bamburiti'); 
  const [arquivo, setArquivo] = useState(null); 
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!arquivo) {
      alert("Por favor, selecione uma imagem para o post.");
      return;
    }

    setLoading(true);

    // 🔑 1. Recupera o token do armazenamento local
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('conteudo', conteudo);
    formData.append('autor', autor);
    formData.append('arquivo', arquivo); 

    try {
      const response = await fetch('http://localhost:8080/api/posts/com-foto', {
        method: 'POST',
        // 🛡️ 2. Adiciona o token no cabeçalho de autorização!
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData 
      });

      if (response.ok) {
        alert("Post publicado com sucesso no ecossistema!");
        setTitulo('');
        setConteudo('');
        setArquivo(null);
        e.target.reset(); 
      } else {
        alert("Falha ao salvar o post no banco. Verifique se seu token é válido.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="atelier-register-wrapper">
      <div className="atelier-register-card">
        <div className="register-header-atelier">
          <span className="register-tag">PAINEL ADMIN</span>
          <h2 className="register-title-atelier">Novo Conteúdo</h2>
          <div className="header-line-atelier"></div>
        </div>

        <form className="register-form-atelier" onSubmit={handleSubmit}>
          <div className="atelier-input-group">
            <label>TÍTULO DO POST</label>
            <input 
              type="text" required value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div className="atelier-input-group">
            <label>AUTOR</label>
            <input 
              type="text" required value={autor}
              onChange={(e) => setAutor(e.target.value)}
            />
          </div>

          <div className="atelier-input-group">
            <label>FOTO / IMAGEM DO POST</label>
            <input 
              type="file" 
              accept="image/*" 
              required 
              onChange={(e) => setArquivo(e.target.files[0])} 
            />
          </div>

          <div className="atelier-input-group">
            <label>CONTEÚDO DO TEXTO</label>
            <textarea 
              rows="5" required value={conteudo}
              onChange={(e) => setConteudo(e.target.value)}
            />
          </div>

          <div className="register-button-spacer">
            <button type="submit" className="btn-atelier-register" disabled={loading}>
              {loading ? "PUBLICANDO..." : "PUBLICAR POST"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
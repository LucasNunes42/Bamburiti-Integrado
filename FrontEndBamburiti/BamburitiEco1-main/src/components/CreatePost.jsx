import React, { useState } from 'react';
import './CreatePost.css';

const CreatePost = () => {
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState('Equipe Bamburiti'); // Valor padrão
  const [arquivo, setArquivo] = useState(null); // Estado para guardar o arquivo binário
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!arquivo) {
      alert("Por favor, selecione uma imagem para o post.");
      return;
    }

    setLoading(true);

    // 📦 Monta o multipart/form-data idêntico ao que o seu Java espera
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('conteudo', conteudo);
    formData.append('autor', autor);
    formData.append('arquivo', arquivo); // Envia o arquivo binário real

    try {
      const response = await fetch('http://localhost:8080/api/posts/com-foto', {
        method: 'POST',
        // ⚠️ ATENÇÃO: Nunca defina 'Content-Type': 'application/json' ou 'multipart/form-data' aqui! 
        // O próprio navegador cuida do boundary automático quando passamos um objeto FormData.
        body: formData 
      });

      if (response.ok) {
        alert("Post publicado com sucesso no ecossistema!");
        // Limpa os campos
        setTitulo('');
        setConteudo('');
        setArquivo(null);
        e.target.reset(); // Reseta o campo visual de arquivo do HTML
      } else {
        alert("Falha ao salvar o post no banco.");
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
            {/* 🆕 Mudado para seletor de arquivos real */}
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
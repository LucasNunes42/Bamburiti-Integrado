import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reaproveitando a identidade visual do Ateliê

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔌 Conexão com o endpoint de recuperação do Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email }) 
      });

      if (response.ok) {
        alert(`As instruções de recuperação foram enviadas para o e-mail: ${email}`);
        setEmail(''); // Limpa o campo de entrada
        navigate('/login'); // Redireciona o usuário de volta para o login
      } else {
        const mensagemErro = await response.text();
        alert(`Não foi possível efetuar o pedido: ${mensagemErro || 'E-mail não encontrado na base de dados.'}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor. O seu Spring Boot está rodando?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="atelier-login-wrapper">
      <div className="atelier-login-card">

        {/* HEADER DO CARD */}
        <div className="login-header-atelier">
          <span className="login-tag">RECUPERAÇÃO</span>
          <h2 className="login-title-atelier">Esqueceu a senha?</h2>
          <p className="login-subtitle-atelier">
            Digite o seu e-mail e enviaremos as instruções de acesso.
          </p>
          <div className="header-line-atelier"></div>
        </div>

        {/* FORMULÁRIO */}
        <form className="login-form-atelier" onSubmit={handleSubmit}>
          
          <div className="atelier-input-group">
            <label htmlFor="emailRecuperacao">E-MAIL CADASTRADO</label>
            <input
              id="emailRecuperacao"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-button-spacer">
            <button type="submit" className="btn-atelier-login" disabled={loading}>
              {loading ? "ENVIANDO..." : "ENVIAR LINK"}
            </button>
          </div>
        </form>

        {/* FOOTER DO CARD */}
        <div className="login-footer-atelier">
          <span>Lembrou da senha? <Link to="/login">Voltar para o Login</Link></span>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
import React, { useState } from 'react';
//import { useNavigate } from 'react-router-dom';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css'; // Reaproveitando os estilos do seu Login!

const RecuperarSenha = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🔌 CONEXÃO REAL AO BACK-END (SPRING BOOT)
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Enviamos apenas o e-mail no corpo do pedido (body)
        body: JSON.stringify({ email: email }) 
      });

      if (response.ok) {
        alert(`As instruções de recuperação foram enviadas para o e-mail: ${email}`);
        setEmail(''); // Limpa o campo de e-mail após o sucesso
        navigate('/login'); // Retorna o utilizador para a página de login
      } else {
        const mensagemErro = await response.text();
        alert(`Não foi possível efetuar o pedido: ${mensagemErro || 'E-mail não encontrado na base de dados.'}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor. O seu Spring Boot está a correr?");
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
            <label>E-MAIL CADASTRADO</label>
            <input
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="login-button-spacer">
            <button type="submit" className="btn-atelier-login" disabled={loading}>
              {loading ? "A ENVIAR..." : "ENVIAR LINK"}
            </button>
          </div>
        </form>

        <div className="login-footer-atelier">
            <span>Lembrou-se da senha? <Link to="/login">Voltar para o Login</Link></span>
        </div>
      </div>
    </div>
  );
};

export default RecuperarSenha;
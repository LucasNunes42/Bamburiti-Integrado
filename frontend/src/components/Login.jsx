import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Ícones importados seguindo a estrutura do site
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar a visibilidade da senha
  const navigate = useNavigate();

  // 🔌 FUNÇÃO QUE CONECTA COM O LOGIN DO SPRING BOOT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          senha: formData.senha
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // 🔑 Salva o Token JWT no navegador para as próximas requisições!
        localStorage.setItem('token', data.token);
        
        alert("Login efetuado com sucesso!");
        navigate('/'); // Redireciona para a Home
        
      } else {
        alert("E-mail ou senha incorretos. Tente novamente.");
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
          <span className="login-tag">BEM-VINDO DE VOLTA</span>
          <h2 className="login-title-atelier">Acesse sua conta</h2>
          <p className="login-subtitle-atelier">
            Continue conectado à nossa rede sustentável.
          </p>
          <div className="header-line-atelier"></div>
        </div>

        {/* FORMULÁRIO */}
        <form className="login-form-atelier" onSubmit={handleSubmit}>
          
          <div className="atelier-input-group">
            <label>E-MAIL</label>
            <input
              type="email"
              placeholder="seu@email.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="atelier-input-group">
            <label>SENHA</label>
            {/* Container estrutural adicionado para o olho */}
            <div className="senha-input-container">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.senha}
                onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              />
              <button
                type="button"
                className="btn-olho-senha"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
                {/* LINK DO ESQUECI A SENHA ENTRA AQUI */}
          <div className="forgot-password-container">
            <a href="/recuperar-senha" className="forgot-password-link">
              Esqueceu a senha?
            </a>
          </div>
          <div className="login-button-spacer"></div>
          <div className="login-button-spacer">
            <button type="submit" className="btn-atelier-login" disabled={loading}>
              {loading ? "ENTRANDO..." : "ENTRAR"}
            </button>
          </div>
        </form>

        <div className="login-footer-atelier">
          <span>Ainda não possui conta? <a href="/registrar">Criar Conta</a></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
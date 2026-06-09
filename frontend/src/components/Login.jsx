import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Ícones oficiais do projeto
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Controle de visibilidade da senha
  const navigate = useNavigate();

  // 🔄 Manipulador genérico para os inputs do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  // 🔌 Conexão com o endpoint de Login do Spring Boot
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
        
        // 🏷️ Armazena o cargo com base no que o seu Back-end retorna
        const tipoUsuario = data.tipoUsuario || data.role || 'USER';
        localStorage.setItem('tipoUsuario', tipoUsuario);
        
        alert("Login efetuado com sucesso!");
        
        // 🔀 Redirecionamento Inteligente baseado no tipo de usuário
        if (tipoUsuario === 'ADMIN') {
          navigate('/admin'); // Admin vai direto para o Painel de Controle
        } else {
          navigate('/'); // Usuário comum vai para a página inicial
        }
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
          
          {/* CAMPO: E-MAIL */}
          <div className="atelier-input-group">
            <label htmlFor="email">E-MAIL</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* CAMPO: SENHA */}
          <div className="atelier-input-group">
            <label htmlFor="senha">SENHA</label>
            <div className="senha-input-container">
              <input
                id="senha"
                name="senha"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.senha}
                onChange={handleChange}
              />
              <button
                type="button"
                className="btn-olho-senha"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Esconder senha" : "Mostrar senha"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* LINK: ESQUECI A SENHA */}
          <div className="forgot-password-container">
            <a href="/recuperar-senha" className="forgot-password-link">
              Esqueceu a senha?
            </a>
          </div>

          {/* BOTÃO DE SUBMIT */}
          <div className="login-button-spacer">
            <button type="submit" className="btn-atelier-login" disabled={loading}>
              {loading ? "ENTRANDO..." : "ENTRAR"}
            </button>
          </div>
        </form>

        {/* FOOTER DO CARD */}
        <div className="login-footer-atelier">
          <span>Ainda não possui conta? <a href="/registrar">Criar Conta</a></span>
        </div>
      </div>
    </div>
  );
};

export default Login;
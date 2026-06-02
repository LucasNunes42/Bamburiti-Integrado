import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Ícones mantidos do Código 2
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Estado para alternar a visibilidade mantido do Código 2

  // 🔌 FUNÇÃO QUE CONECTA COM O LOGIN DO SPRING BOOT (Sua lógica do Código 1)
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

        // 🔑 Salva o Token JWT
        localStorage.setItem('token', data.token);

        // 🆕 Salva o tipo do usuário (Código 1)
        localStorage.setItem('tipoUsuario', data.tipoUsuario || 'ADMIN');

        alert("Login efetuado com sucesso!");

        // 🆕 Redireciona forçando um recarregamento da página (Código 1)
        window.location.href = '/';

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
            {/* Container estrutural para o olho mantido do Código 2 */}
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
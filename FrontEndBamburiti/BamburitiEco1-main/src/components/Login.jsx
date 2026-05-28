import React, { useState } from 'react';
// Removemos o useNavigate pois usaremos o window.location para forçar o recarregamento do Header
import './Login.css'; 

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [loading, setLoading] = useState(false);

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
        
        // 🔑 Salva o Token JWT
        localStorage.setItem('token', data.token);

        // 🆕 NOVO: Salva o tipo do usuário
        // Certifique-se de que o seu backend Spring Boot está enviando a variável "tipoUsuario" (ou "role") na resposta do login junto com o token!
        localStorage.setItem('tipoUsuario', data.tipoUsuario || 'ADMIN'); 
        
        alert("Login efetuado com sucesso!");
        
        // 🆕 NOVO: Redireciona forçando um recarregamento da página. 
        // Isso faz com que o Header leia o localStorage atualizado imediatamente e exiba o botão!
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
            <input
              type="password"
              placeholder="••••••••"
              required
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
            />
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
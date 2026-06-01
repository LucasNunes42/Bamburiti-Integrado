import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import './Login.css';

const NovaSenha = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Captura o token do link do e-mail
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (novaSenha !== confirmarSenha) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, novaSenha })
      });

      if (response.ok) {
        alert("Senha alterada com sucesso! Agora você já pode fazer login.");
        navigate('/login');
      } else {
        const erro = await response.text();
        alert(`Erro: ${erro}`);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="atelier-login-wrapper">
      <div className="atelier-login-card">
        <div className="login-header-atelier">
          <span className="login-tag">SEGURANÇA</span>
          <h2 className="login-title-atelier">Nova Senha</h2>
          <p className="login-subtitle-atelier">Digite e confirme sua nova senha de acesso.</p>
          <div className="header-line-atelier"></div>
        </div>

        <form className="login-form-atelier" onSubmit={handleSubmit}>
          <div className="atelier-input-group">
            <label>NOVA SENHA</label>
            <input 
              type="password" 
              required 
              value={novaSenha} 
              onChange={(e) => setNovaSenha(e.target.value)} 
            />
          </div>

          <div className="atelier-input-group">
            <label>CONFIRMAR NOVA SENHA</label>
            <input 
              type="password" 
              required 
              value={confirmarSenha} 
              onChange={(e) => setConfirmarSenha(e.target.value)} 
            />
          </div>

          <div className="login-button-spacer">
            <button type="submit" className="btn-atelier-login" disabled={loading}>
              {loading ? "SALVANDO..." : "ALTERAR SENHA"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NovaSenha;
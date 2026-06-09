import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Ícones importados para o padrão Bamburiti
import './Login.css';

const NovaSenha = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token'); // Captura o token do link do e-mail
  const navigate = useNavigate();

  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados independentes para alternar a visibilidade de cada campo de senha
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          
          {/* CAMPO: NOVA SENHA */}
          <div className="atelier-input-group">
            <label htmlFor="novaSenha">NOVA SENHA</label>
            <div className="senha-input-container">
              <input 
                id="novaSenha"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••"
                required 
                value={novaSenha} 
                onChange={(e) => setNovaSenha(e.target.value)} 
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

          {/* CAMPO: CONFIRMAR NOVA SENHA */}
          <div className="atelier-input-group">
            <label htmlFor="confirmarSenha">CONFIRMAR NOVA SENHA</label>
            <div className="senha-input-container">
              <input 
                id="confirmarSenha"
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="••••••••"
                required 
                value={confirmarSenha} 
                onChange={(e) => setConfirmarSenha(e.target.value)} 
              />
              <button
                type="button"
                className="btn-olho-senha"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? "Esconder confirmação de senha" : "Mostrar confirmação de senha"}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
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
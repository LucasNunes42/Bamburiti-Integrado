import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importação dos ícones padrão
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    usuario: '',
    email: '',
    senha: '',
    confirmaSenha: '', // 🆕 Novo campo adicionado ao estado
    termos: false
  });

  const [loading, setLoading] = useState(false);

  // 🆕 Estados independentes para exibir/ocultar cada senha (Iniciam como false = ocultos)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validarSenhaForte = (senha, usuario) => {
    const senhasProibidas = ["123", "1234", "123456", "abcdef", "mudar123", "senha"];

    if (senha.length < 8) {
      return "A senha deve ter pelo menos 8 caracteres.";
    }

    if (senhasProibidas.includes(senha.toLowerCase())) {
      return "Esta senha é muito comum. Por favor, crie uma senha mais segura.";
    }

    if (usuario && senha.toLowerCase().includes(usuario.toLowerCase())) {
      return "A senha não pode conter o seu nome de usuário.";
    }

    const temLetra = /[a-zA-Z]/.test(senha);
    const temNumero = /[0-9]/.test(senha);
    if (!temLetra || !temNumero) {
      return "A senha deve conter pelo menos uma letra e um número.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🆕 VALIDAÇÃO 1: Verifica se as senhas coincidem ANTES de qualquer coisa
    if (formData.senha !== formData.confirmaSenha) {
      alert("As senhas não coincidem. Por favor, verifique e digite novamente.");
      return;
    }

    // VALIDAÇÃO 2: Força da senha
    const erroSenha = validarSenhaForte(formData.senha, formData.usuario);
    if (erroSenha) {
      alert(erroSenha);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/auth/registrar', {
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
        alert("Conta criada com sucesso no ecossistema!");
        // Limpa todos os campos
        setFormData({ usuario: '', email: '', senha: '', confirmaSenha: '', termos: false });
        setShowPassword(false);
        setShowConfirmPassword(false);
      } else {
        const mensagemErro = await response.text();
        alert(`Erro no cadastro: ${mensagemErro || 'Tente novamente.'}`);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Não foi possível conectar ao servidor. O seu Spring Boot está rodando?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="atelier-register-wrapper">
      <div className="atelier-register-card">

        {/* HEADER DO CARD */}
        <div className="register-header-atelier">
          <span className="register-tag">COMUNIDADE</span>
          <h2 className="register-title-atelier">Faça parte do ecossistema</h2>
          <p className="register-subtitle-atelier">
            Conecte-se à nossa rede de bioestrutura e sustentabilidade.
          </p>
          <div className="header-line-atelier"></div>
        </div>

        {/* FORMULÁRIO */}
        <form className="register-form-atelier" onSubmit={handleSubmit}>
          <div className="atelier-input-group">
            <label>NOME DE USUÁRIO</label>
            <input
              type="text"
              placeholder="usuario"
              required
              value={formData.usuario}
              onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
            />
          </div>

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

          {/* 🆕 NOVO CAMPO: CONFIRMAR SENHA */}
          <div className="atelier-input-group">
            <label>CONFIRMAR SENHA</label>
            <div className="senha-input-container">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.confirmaSenha}
                onChange={(e) => setFormData({ ...formData, confirmaSenha: e.target.value })}
              />
              <button
                type="button"
                className="btn-olho-senha"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="atelier-checkbox-area">
            <label className="atelier-checkbox-label">
              <input
                type="checkbox"
                required
                checked={formData.termos}
                onChange={(e) => setFormData({ ...formData, termos: e.target.checked })}
              />
              <span className="atelier-checkmark"></span>
              {/* MODIFICAÇÃO AQUI: Texto alterado para conter o link */}
              Aceito os{" "}
              <a
                href="/termos"
                className="termos-link"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                termos de sustentabilidade
              </a>
            </label>
          </div>

          <div className="register-button-spacer">
            <button type="submit" className="btn-atelier-register" disabled={loading}>
              {loading ? "CRIANDO CONTA..." : "CRIAR MINHA CONTA"}
            </button>
          </div>
        </form>

        <div className="register-footer-atelier">
          <span>Já possui uma conta? <a href="/login">Entrar</a></span>
        </div>
      </div>
    </div>
  );
};

export default Register;
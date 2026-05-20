import React, { useState } from 'react';
import { FaLeaf, FaTimes, FaArrowRight, FaCheck, FaPaperPlane } from 'react-icons/fa';
import './ChatBot.css';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ nome: '', email: '', mensagem: '' });

  // FUNÇÃO PARA RESETAR TUDO
  const resetChat = () => {
    setIsOpen(false);
    // Pequeno delay para resetar os campos só depois que o painel fechar (suavidade visual)
    setTimeout(() => {
      setStep(1);
      setForm({ nome: '', email: '', mensagem: '' });
    }, 500);
  };

  const toggleChat = () => {
    if (isOpen) {
      resetChat(); 
    } else {
      setIsOpen(true);
    }
  };

  const handleDatabaseSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("Enviando lead para o banco Bamburiti:", form);
      
      // 🔌 CONEXÃO REAL COM O SEU BACK-END
      const response = await fetch('http://localhost:8080/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Traduzimos 'mensagem' do React para 'texto' que o Java espera
        body: JSON.stringify({
          nome: form.nome,
          email: form.email,
          texto: form.mensagem 
        })
      });

      if (response.ok) {
        const dadosSalvos = await response.json();
        console.log("Lead salvo com sucesso! ID:", dadosSalvos.id);
        
        // Avança para o Passo 4 (Tela de Sucesso)
        setStep(4);
      } else {
        alert("O servidor respondeu com um erro ao tentar salvar o Lead.");
      }

    } catch (error) {
      console.error("Erro na integração:", error);
      alert("Não foi possível conectar ao Back-end. Verifique se o Spring Boot está rodando na porta 8080.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bamburiti-atelier-root ${isOpen ? 'is-open' : ''}`}>
      
      {!isOpen && (
        <button className="atelier-trigger-pill" onClick={toggleChat}>
          <FaLeaf className="leaf-icon-pill" />
          <span className="pill-label">CONSULTORIA</span>
        </button>
      )}

      <div className="atelier-panel">
        {/* BOTÃO X AGORA USA O RESET */}
        <button className="panel-close" onClick={resetChat}><FaTimes /></button>
        
        <div className="panel-header">
          <span className="step-indicator">PASSO 0{step} / 04</span>
          <h2>Bamburiti</h2>
          <p>Ateliê de Bioestruturas</p>
          <div className="header-line"></div>
        </div>

        <div className="panel-content">
          {step === 1 && (
            <div className="step-fade">
              <h3>Bem-vindo ao Ateliê.</h3>
              <p className="description-text">
                Inicie um diálogo sobre seu projeto personalizado. Unimos a inteligência do bambu com a precisão da engenharia moderna.
              </p>
              <button className="btn-atelier-action" onClick={() => setStep(2)}>
                INICIAR DIÁLOGO <FaArrowRight />
              </button>
            </div>
          )}

          {step === 2 && (
            <form className="step-fade" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
              <div className="input-field">
                <label>COMO DEVEMOS TE CHAMAR?</label>
                <input type="text" required placeholder="Seu nome completo"
                  value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
              </div>
              <div className="input-field">
                <label>QUAL SEU MELHOR E-MAIL?</label>
                <input type="email" required placeholder="exemplo@email.com"
                  value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <button type="submit" className="btn-atelier-action">PRÓXIMO PASSO</button>
            </form>
          )}

          {step === 3 && (
            <form className="step-fade" onSubmit={handleDatabaseSubmit}>
              <div className="input-field">
                <label>FALE SOBRE SEU PROJETO OU DÚVIDA</label>
                <textarea rows="5" required placeholder="Descreva seu interesse..."
                  value={form.mensagem} onChange={e => setForm({...form, mensagem: e.target.value})}></textarea>
              </div>
              <button type="submit" className="btn-atelier-send" disabled={loading}>
                {loading ? "PROCESSANDO..." : "ENVIAR AO ATELIÊ"}
                {!loading && <FaPaperPlane style={{marginLeft: '10px'}} />}
              </button>
            </form>
          )}

          {step === 4 && (
            <div className="step-fade success-view">
              <div className="success-circle"><FaCheck /></div>
              <h3>Mensagem Recebida.</h3>
              <p className="description-text">Obrigado, {form.nome}. Seus dados foram encaminhados ao nosso Ateliê de Bioestruturas.</p>
              {/* BOTÃO CONCLUÍDO TAMBÉM RESETA */}
              <button className="btn-atelier-close" onClick={resetChat}>CONCLUÍDO</button>
            </div>
          )}
        </div>

        <div className="panel-footer">TECNOLOGIA & BIOESTRUTURAS</div>
      </div>
    </div>
  );
};

export default ChatBot;
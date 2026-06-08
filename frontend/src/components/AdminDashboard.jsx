import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [usuarios, setUsuarios] = useState([]);
  const [posts, setPosts] = useState([]);
  const [leads, setLeads] = useState([]);
  const [leadsLidos, setLeadsLidos] = useState([]);
  const [busca, setBusca] = useState('');

  // 📥 Estados de Controle dos Modais
  const [modalPostAberto, setModalPostAberto] = useState(false);
  const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false);
  const [modalLeadAberto, setModalLeadAberto] = useState(false); // 👈 Novo modal adicionado

  // 📝 Estados dos Formulários dos Modais
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState(null);
  const [leadSelecionado, setLeadSelecionado] = useState(null); // 👈 Novo estado de lead selecionado

  // Campos Post
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState('Equipe Bamburiti');
  const [arquivo, setArquivo] = useState(null);

  // Campos Usuário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('USER');

  const token = localStorage.getItem('token');

  // 🛡️ Função para descobrir o e-mail do Administrador logado atualmente através do JWT
  const obterEmailLogado = () => {
    if (!token) return '';
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      return payload.sub || '';
    } catch (err) {
      return '';
    }
  };
  const emailLogado = obterEmailLogado();

  useEffect(() => {
    setBusca('');
  }, [activeTab]);

  const carregarUsuarios = useCallback(async () => {
    console.log("Token enviado na requisição:", token);
    try {
      const response = await fetch('http://localhost:8080/api/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const dados = await response.json();
        setUsuarios(dados);
      }
    } catch (err) { console.error("Erro ao buscar usuários", err); }
  }, [token]);

  const carregarPosts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/posts');
      if (response.ok) {
        const dados = await response.json();
        setPosts(dados);
      }
    } catch (err) { console.error("Erro ao buscar posts", err); }
  }, []);

  const carregarLeads = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/leads', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const dados = await response.json();
        setLeads(dados);
      }
    } catch (err) { console.error("Erro ao buscar contatos", err); }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'usuarios' && usuarios.length === 0) carregarUsuarios();
    if (activeTab === 'posts' && posts.length === 0) carregarPosts();
    if (activeTab === 'leads' && leads.length === 0) carregarLeads();
  }, [activeTab, carregarUsuarios, carregarPosts, carregarLeads, usuarios.length, posts.length, leads.length]);

  // 🗑️ DELETAR E MARCAR LEAD COMO LIDO
  const deletarLead = async (id) => {
    if (!window.confirm("Tem certeza que deseja apagar esta mensagem?")) return;
    try {
      const response = await fetch(`http://localhost:8080/api/leads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("Mensagem apagada!");
        carregarLeads();
      }
    } catch (err) { alert("Erro ao deletar mensagem."); }
  };

  const alternarLido = (id) => {
    if (leadsLidos.includes(id)) {
      setLeadsLidos(leadsLidos.filter(leadId => leadId !== id)); // Desmarca
    } else {
      setLeadsLidos([...leadsLidos, id]); // Marca
    }
  };

  // 🔍 Função para abrir o visualizador de Leads
  const abrirVisualizarLead = (lead) => {
    setLeadSelecionado(lead);
    setModalLeadAberto(true);
    // Marca automaticamente como lido ao abrir para facilitar o controle
    if (!leadsLidos.includes(lead.id)) {
      setLeadsLidos([...leadsLidos, lead.id]);
    }
  };

  // 🗑️ DELETAR POST
  const deletarPost = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este post?")) return;
    try {
      const response = await fetch(`http://localhost:8080/api/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("Post removido!");
        carregarPosts();
      }
    } catch (err) { alert("Erro ao deletar post."); }
  };

  // 🗑️ DELETAR USUÁRIO
  const deletarUsuario = async (id) => {
    if (!window.confirm("Remover permanentemente este usuário?")) return;
    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert("Usuário deletado!");
        carregarUsuarios();
      }
    } catch (err) { alert("Erro ao deletar usuário."); }
  };

  // 🔀 SELETOR DE CARGO COM SISTEMA DE SEGURANÇA ANTICLIDADO
  const alternarCargo = async (id, emailUsuario, cargoAtual, novoCargo) => {
    if (cargoAtual === novoCargo) return;

    if (emailUsuario === emailLogado && novoCargo !== 'ADMIN') {
      const primeiraConfirmacao = window.confirm("⚠️ ATENÇÃO CRÍTICA: Você está alterando o SEU PRÓPRIO cargo para USER! Se confirmar, você perderá acesso imediato a esta tela de gerenciamento. Deseja mesmo continuar?");
      if (!primeiraConfirmacao) return;

      const segundaConfirmacao = window.confirm("❌ CONFIRMAÇÃO FINAL: Tem certeza absoluta disso? Você será bloqueado deste painel.");
      if (!segundaConfirmacao) return;
    } else {
      const confirmacaoPadrao = window.confirm(`Deseja alterar o cargo do usuário "${emailUsuario}" de ${cargoAtual} para ${novoCargo}?`);
      if (!confirmacaoPadrao) return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${id}/alterar-perfil?novoTipo=${novoCargo}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert(`Cargo de ${emailUsuario} updated para ${novoCargo}!`);
        carregarUsuarios();
      } else {
        alert("Falha ao atualizar o cargo no servidor.");
      }
    } catch (err) { alert("Erro ao alterar cargo."); }
  };

  // 💾 SALVAR / ATUALIZAR POST
  const salvarPost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('conteudo', conteudo);
    formData.append('autor', autor);
    if (arquivo) formData.append('arquivo', arquivo);

    const url = modoEdicao ? `http://localhost:8080/api/posts/${idSelecionado}` : 'http://localhost:8080/api/posts/com-foto';
    const metodo = modoEdicao ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: metodo,
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (response.ok) {
        alert(modoEdicao ? "Post atualizado com sucesso!" : "Post criado com sucesso!");
        fecharModais();
        carregarPosts();
      } else {
        alert("Erro ao salvar o post. Verifique as credenciais.");
      }
    } catch (err) { console.error(err); }
  };

  // 💾 SALVAR USUÁRIO
  const salvarUsuario = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha, tipoUsuario })
      });

      if (response.ok) {
        alert("Novo usuário registrado com sucesso!");
        fecharModais();
        carregarUsuarios();
      } else {
        alert("Falha ao registrar usuário.");
      }
    } catch (err) { console.error(err); }
  };

  // ⚙️ ABRIR MODAL PARA EDIÇÃO (POST)
  const abrirEditarPost = (post) => {
    setModoEdicao(true);
    setIdSelecionado(post.id);
    setTitulo(post.titulo);
    setConteudo(post.conteudo);
    setAutor(post.autor);
    setModalPostAberto(true);
  };

  const fecharModais = () => {
    setModalPostAberto(false);
    setModalUsuarioAberto(false);
    setModalLeadAberto(false); // 👈 Limpa o novo modal
    setModoEdicao(false);
    setIdSelecionado(null);
    setLeadSelecionado(null); // 👈 Limpa o lead ativo
    setTitulo('');
    setConteudo('');
    setAutor('Equipe Bamburiti');
    setArquivo(null);
    setEmail('');
    setSenha('');
    setTipoUsuario('USER');
  };

  // Filtros dinâmicos
  const postsFiltrados = posts.filter(post =>
    post.titulo?.toLowerCase().includes(busca.toLowerCase()) ||
    post.autor?.toLowerCase().includes(busca.toLowerCase()) ||
    String(post.id).includes(busca)
  );

  const usuariosFiltrados = usuarios.filter(user =>
    user.email?.toLowerCase().includes(busca.toLowerCase()) ||
    String(user.idUsuario).includes(busca) ||
    user.tipoUsuario?.toLowerCase().includes(busca.toLowerCase())
  );

  const leadsFiltrados = leads.filter(lead =>
    lead.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    lead.email?.toLowerCase().includes(busca.toLowerCase()) ||
    lead.texto?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <h2>Bamburiti Admin</h2>
        <button className={activeTab === 'posts' ? 'active' : ''} onClick={() => setActiveTab('posts')}>
          📋 Gerenciar Posts
        </button>
        <button className={activeTab === 'usuarios' ? 'active' : ''} onClick={() => setActiveTab('usuarios')}>
          👥 Gerenciar Usuários
        </button>
        <button className={activeTab === 'leads' ? 'active' : ''} onClick={() => setActiveTab('leads')}>
          📩 Fale Conosco
        </button>
      </div>

      <div className="admin-content">
        {/* BARRA DE PESQUISA */}
        <div className="admin-search-container" style={{ marginBottom: '20px' }}>
          <input
            type="text"
            className="admin-search-input"
            placeholder={
              activeTab === 'posts' 
                ? "🔍 Buscar post por título, autor ou ID..." 
                : activeTab === 'usuarios' 
                ? "🔍 Buscar usuário por e-mail, nível ou ID..." 
                : "🔍 Buscar mensagem por nome, e-mail ou conteúdo..."
            }
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        {/* SEÇÃO POSTS */}
        {activeTab === 'posts' && (
          <div className="panel-section">
            <div className="panel-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Postagens Publicadas</h3>
              <button className="btn-create-dashboard" onClick={() => setModalPostAberto(true)}>
                ➕ Novo Post
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Autor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {postsFiltrados.map(post => (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.titulo}</td>
                      <td>{post.autor}</td>
                      <td>
                        <button className="btn-icon-edit" title="Editar" onClick={() => abrirEditarPost(post)}>✏️</button>
                        <button className="btn-icon-delete" title="Excluir" onClick={() => deletarPost(post.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEÇÃO USUÁRIOS */}
        {activeTab === 'usuarios' && (
          <div className="panel-section">
            <div className="panel-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Controle de Usuários</h3>
              <button className="btn-create-dashboard" onClick={() => setModalUsuarioAberto(true)}>
                ➕ Novo Usuário
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>E-mail</th>
                    <th>Nível de Acesso</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosFiltrados.map(user => (
                    <tr key={user.idUsuario}>
                      <td>{user.idUsuario}</td>
                      <td>{user.email}</td>
                      <td><span className={`badge ${user.tipoUsuario?.toLowerCase()}`}>{user.tipoUsuario}</span></td>
                      <td>
                        <select
                          className="admin-role-select"
                          value={user.tipoUsuario || 'USER'}
                          onChange={(e) => alternarCargo(user.idUsuario, user.email, user.tipoUsuario, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '4px',
                            marginRight: '10px',
                            cursor: 'pointer',
                            border: '1px solid #ccc',
                            backgroundColor: '#fff'
                          }}
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button className="btn-icon-delete" title="Excluir" onClick={() => deletarUsuario(user.idUsuario)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SEÇÃO LEADS (FALE CONOSCO) */}
        {activeTab === 'leads' && (
          <div className="panel-section">
            <div className="panel-header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3>Caixa de Entrada: Projetos e Dúvidas</h3>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Mensagem</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsFiltrados.map(lead => (
                    <tr key={lead.id} className={leadsLidos.includes(lead.id) ? 'row-lida' : ''}>
                      <td>{lead.dataCriacao ? new Date(lead.dataCriacao).toLocaleDateString('pt-BR') : '---'}</td>
                      <td>{lead.nome}</td>
                      <td>{lead.email}</td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={lead.texto}>
                        {lead.texto}
                      </td>
                      <td>
                        {/* 👁️ Novo botão para visualizar o conteúdo completo */}
                        <button className="btn-icon-view" title="Visualizar Mensagem" onClick={() => abrirVisualizarLead(lead)}>👁️</button>
                        <button className="btn-icon-check" title="Marcar como Resolvido" onClick={() => alternarLido(lead.id)}>
                          {leadsLidos.includes(lead.id) ? '✅' : '✔️'}
                        </button>
                        <button className="btn-icon-delete" title="Excluir Mensagem" onClick={() => deletarLead(lead.id)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 🟦 MODAL FLUTUANTE: POSTS (CRIAR E EDITAR) */}
      {modalPostAberto && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{modoEdicao ? "✏️ Editar Postagem" : "🚀 Publicar Novo Conteúdo"}</h3>
            <form onSubmit={salvarPost}>
              <label>TÍTULO</label>
              <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} />

              <label>AUTOR</label>
              <input type="text" required value={autor} onChange={(e) => setAutor(e.target.value)} />

              <label>FOTO DO POST {modoEdicao && "(Deixe em branco se não quiser alterar)"}</label>
              <input type="file" accept="image/*" required={!modoEdicao} onChange={(e) => setArquivo(e.target.files[0])} />

              <label>CONTEÚDO</label>
              <textarea rows="5" required value={conteudo} onChange={(e) => setConteudo(e.target.value)}></textarea>

              <div className="modal-buttons">
                <button type="submit" className="btn-submit-modal">SALVAR</button>
                <button type="button" className="btn-close-modal" onClick={fecharModais}>CANCELAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟩 MODAL FLUTUANTE: USUÁRIOS (CRIAR NOVO) */}
      {modalUsuarioAberto && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>👥 Criar Usuário Admin / User</h3>
            <form onSubmit={salvarUsuario}>
              <label>E-MAIL</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

              <label>SENHA</label>
              <input type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} />

              <label>NÍVEL DE ACESSO</label>
              <select value={tipoUsuario} onChange={(e) => setTipoUsuario(e.target.value)}>
                <option value="USER">USER (Cliente comum)</option>
                <option value="ADMIN">ADMIN (Administrador geral)</option>
              </select>

              <div className="modal-buttons">
                <button type="submit" className="btn-submit-modal">REGISTRAR</button>
                <button type="button" className="btn-close-modal" onClick={fecharModais}>CANCELAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🟨 MODAL FLUTUANTE NOVO: VISUALIZAR DETALHES DO LEAD */}
      {modalLeadAberto && leadSelecionado && (
        <div className="modal-overlay">
          <div className="modal-card lead-view-card">
            <h3>👁️ Detalhes do Contato</h3>
            
            <div className="lead-detail-group">
              <label>REMETENTE</label>
              <p className="lead-detail-text"><strong>{leadSelecionado.nome}</strong> ({leadSelecionado.email})</p>
            </div>

            <div className="lead-detail-group">
              <label>DATA DO ENVIO</label>
              <p className="lead-detail-text">
                {leadSelecionado.dataCriacao ? new Date(leadSelecionado.dataCriacao).toLocaleString('pt-BR') : '---'}
              </p>
            </div>

            <div className="lead-detail-group">
              <label>CONTEÚDO DA MENSAGEM</label>
              <div className="lead-message-box">
                {leadSelecionado.texto}
              </div>
            </div>

            <div className="modal-buttons">
              <button type="button" className="btn-close-modal" onClick={fecharModais}>FECHAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
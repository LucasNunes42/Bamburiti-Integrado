import React, { useState, useEffect, useCallback } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [usuarios, setUsuarios] = useState([]);
  const [posts, setPosts] = useState([]);
  const [busca, setBusca] = useState(''); 
  
  // 📥 Estados de Controle dos Modais
  const [modalPostAberto, setModalPostAberto] = useState(false);
  const [modalUsuarioAberto, setModalUsuarioAberto] = useState(false);
  
  // 📝 Estados dos Formulários dos Modais
  const [modoEdicao, setModoEdicao] = useState(false);
  const [idSelecionado, setIdSelecionado] = useState(null);

  // Campos Post
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [autor, setAutor] = useState('Equipe Bamburiti');
  const [arquivo, setArquivo] = useState(null);

  // Campos Usuário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('USER'); // Estado do formulário

  const token = localStorage.getItem('token'); 
  const tipoUsuarioLogado = localStorage.getItem('tipoUsuario'); // 👈 Variável renomeada para evitar conflito

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

  useEffect(() => {
    if (activeTab === 'usuarios') carregarUsuarios();
    if (activeTab === 'posts') carregarPosts();
  }, [activeTab, carregarUsuarios, carregarPosts]);

  // 🗑️ DELETAR POST
  const deledarPost = async (id) => {
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

    // ⛔ Validação Crítica: Evitar que você remova o seu próprio acesso Admin por engano
    if (emailUsuario === emailLogado && novoCargo !== 'ADMIN') {
      const primeiraConfirmacao = window.confirm("⚠️ ATENÇÃO CRÍTICA: Você está alterando o SEU PRÓPRIO cargo para USER! Se confirmar, você perderá acesso imediato a esta tela de gerenciamento. Deseja mesmo continuar?");
      if (!primeiraConfirmacao) return;

      const segundaConfirmacao = window.confirm("❌ CONFIRMAÇÃO FINAL: Tem certeza absoluta disso? Você será bloqueado deste painel.");
      if (!segundaConfirmacao) return;
    } else {
      // Confirmação padrão para os demais usuários cadastrados
      const confirmacaoPadrao = window.confirm(`Deseja alterar o cargo do usuário "${emailUsuario}" de ${cargoAtual} para ${novoCargo}?`);
      if (!confirmacaoPadrao) return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/usuarios/${id}/alterar-perfil?novoTipo=${novoCargo}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        alert(`Cargo de ${emailUsuario} atualizado para ${novoCargo}!`);
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
        alert(modoEdicao ? "Post updated com sucesso!" : "Post criado com sucesso!");
        fecharModais();
        carregarPosts();
      } else {
        alert("Erro ao salvar o post. Verifique as credenciais.");
      }
    } catch (err) { console.error(err); }
  };

  // 💾 SALVAR USUÁRIO (Criar diretamente pela sua API de registro)
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
    setModoEdicao(false);
    setIdSelecionado(null);
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

  // 🛡️ GUARDA DE ROTA: Posicionado AQUI, após todos os hooks do React, para evitar crash.
  if (!token || tipoUsuarioLogado !== 'ADMIN') {
    return (
      <div className="acesso-negado-container">
        <h2>🚫 Acesso Negado</h2>
        <p>Você não tem permissão para acessar o ecossistema administrativo da Bamburiti.</p>
        <a href="/login" className="acesso-negado-link">Ir para o Login</a>
      </div>
    );
  }

  // Se passou da guarda de rota, renderiza o painel normalmente
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
      </div>

      <div className="admin-content">
        
        {/* BARRA DE PESQUISA */}
        <div className="admin-search-container" style={{ marginBottom: '20px' }}>
          <input 
            type="text"
            className="admin-search-input"
            placeholder={activeTab === 'posts' ? "🔍 Buscar post por título, autor ou ID..." : "🔍 Buscar usuário por e-mail, nível ou ID..."}
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
                        <button className="btn-icon-delete" title="Excluir" onClick={() => deledarPost(post.id)}>🗑️</button>
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
                        {/* 🔄 BANDEJA DE SELEÇÃO EXPLÍCITA DE CARGOS */}
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
    </div>
  );
};

export default AdminDashboard;
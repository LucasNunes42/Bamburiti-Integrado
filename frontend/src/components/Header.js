import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Header.css';
import logo from '../assets/img/logo bamburiti.png';
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const [openAccount, setOpenAccount] = useState(false); // Dropdown da conta
  const [menuMobile, setMenuMobile] = useState(false); // Menu hambúrguer
  const navigate = useNavigate();

  // VERIFICAÇÃO DE LOGIN ESTADO ATUAL
  const isLogged = !!localStorage.getItem('token');
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  const handleNavigation = (path) => {
    navigate(path);
    setOpenAccount(false);
    setMenuMobile(false); 
  };

  // FUNÇÃO PARA FAZER LOGOUT (Limpa o armazenamento)
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tipoUsuario');
    setOpenAccount(false);
    setMenuMobile(false);
    navigate('/');
  };

  return (
    <header className="main-header">
      <div className="header-container">

        {/* HAMBÚRGUER */}
        <div className="mobile-menu-icon" onClick={() => setMenuMobile(!menuMobile)}>
          {menuMobile ? <FaTimes /> : <FaBars />}
        </div>

        {/* ESQUERDA - Logo */}
        <div className="header-left">
          <Link to="/" onClick={() => setMenuMobile(false)}>
            <img src={logo} alt="Logo Bamburiti" className="navbar-logo" />
          </Link>
        </div>

        {/* CENTRO - Menu */}
        <nav className={`header-center ${menuMobile ? 'active' : ''}`}>
          <ul className="header-menu">
            <li><Link to="/" onClick={() => setMenuMobile(false)}>Home</Link></li>
            <li><a href="#agroecologia" onClick={() => setMenuMobile(false)}>Agroecologia</a></li>
            <li><a href="#workshop" onClick={() => setMenuMobile(false)}>Workshop</a></li>
            <li><a href="#bio" onClick={() => setMenuMobile(false)}>Bio Estruturas</a></li>
            <li><Link to="/blog" onClick={() => setMenuMobile(false)}>Blog</Link></li>
            <li><Link to="/sobre" onClick={() => setMenuMobile(false)}>Sobre</Link></li>
            
            {/* SE FOR ADMIN: Mostra o link destacado também no menu central */}
            {tipoUsuario === 'ADMIN' && (
              <li>
                <Link to="/admin" onClick={() => setMenuMobile(false)} style={{ color: '#00A550', fontWeight: 'bold' }}>
                  ⚙️ Painel Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* DIREITA - Ações */}
        <div className="header-actions">
          <div className="account-area">
            <FaUser 
              className="header-icon"
              style={isLogged ? { color: '#00A550', filter: 'drop-shadow(0 0 4px rgba(0,165,80,0.2))' } : {}}
              onClick={() => setOpenAccount(!openAccount)}
            />
            
            {openAccount && (
              <div className="dropdown-menu-custom">
                {/* Se NÃO estiver logado: mostra opções normais */}
                {!isLogged ? (
                  <>
                    <button onClick={() => handleNavigation('/login')}>Entrar</button>
                    <button onClick={() => handleNavigation('/registrar')}>Registrar-se</button>
                  </>
                ) : (
                  // Se ESTIVER logado: mostra o Painel Admin e o botão de Logout
                  <>
                    {tipoUsuario === 'ADMIN' && (
                      <button 
                        onClick={() => handleNavigation('/admin')} 
                        style={{ fontWeight: 'bold', color: '#00A550', borderBottom: '1px solid #eee', paddingBottom: '10px' }}
                      >
                        ⚙️ Painel Admin
                      </button>
                    )}
                    <button onClick={handleLogout} style={{ color: '#c5221f', paddingTop: '10px' }}>
                      Sair
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="cart-area">
            <FaShoppingCart className="header-icon" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
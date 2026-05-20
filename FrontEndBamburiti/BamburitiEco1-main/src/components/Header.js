import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import './Header.css';
import logo from '../assets/img/logo bamburiti.png';
// Adicionei FaBars e FaTimes para o hambúrguer
import { FaUser, FaShoppingCart, FaBars, FaTimes } from 'react-icons/fa';

function Header() {
  const [openAccount, setOpenAccount] = useState(false); // Dropdown da conta
  const [menuMobile, setMenuMobile] = useState(false); // Menu hambúrguer
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setOpenAccount(false);
    setMenuMobile(false); // Fecha o menu ao navegar
  };

  return (
    <header className="main-header">
      <div className="header-container">

        {/* HAMBÚRGUER (Aparece apenas no Mobile via CSS) */}
        <div className="mobile-menu-icon" onClick={() => setMenuMobile(!menuMobile)}>
          {menuMobile ? <FaTimes /> : <FaBars />}
        </div>

        {/* ESQUERDA - Logo */}
        <div className="header-left">
          <Link to="/" onClick={() => setMenuMobile(false)}>
            <img src={logo} alt="Logo Bamburiti" className="navbar-logo" />
          </Link>
        </div>

        {/* CENTRO - Menu (Ganhas a classe 'active' no Mobile) */}
        <nav className={`header-center ${menuMobile ? 'active' : ''}`}>
          <ul className="header-menu">
            <li><Link to="/" onClick={() => setMenuMobile(false)}>Home</Link></li>
            <li><a href="#agroecologia" onClick={() => setMenuMobile(false)}>Agroecologia</a></li>
            <li><a href="#workshop" onClick={() => setMenuMobile(false)}>Workshop</a></li>
            <li><a href="#bio" onClick={() => setMenuMobile(false)}>Bio Estruturas</a></li>
            <li><a href="#sobre" onClick={() => setMenuMobile(false)}>Sobre</a></li>
          </ul>
        </nav>

        {/* DIREITA - Ações */}
        <div className="header-actions">
          <div className="account-area">
            <FaUser 
              className="header-icon"
              onClick={() => setOpenAccount(!openAccount)}
            />
            {openAccount && (
              <div className="dropdown-menu-custom">
                <button onClick={() => handleNavigation('/login')}>Entrar</button>
                <button onClick={() => handleNavigation('/registrar')}>Registrar-se</button>
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
import React from 'react';
import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faWhatsapp, faYoutube } from '@fortawesome/free-brands-svg-icons';
// IMPORTAMOS A LOGO
import logoBamburiti from '../assets/img/logo bamburiti.png';

const Footer = () => {
    return (
        <footer className="footer-main">
            <div className="footer-container">

                {/* Coluna 1: Logo e Missão */}
                <div className="footer-column brand-col">
                    {/* SUBSTITUÍMOS O TEXTO PELA IMAGEM DO LOGO */}
                    <img
                        src={logoBamburiti}
                        alt="Logo Bamburiti"
                        className="footer-logo-img"
                    />
                    <p className="footer-tagline">
                        Sustentabilidade em cada pedalada. Unindo design, agroecologia e mobilidade urbana em Brasília.
                    </p>
                    <div className="footer-social-icons">
                        <a
                            href="https://instagram.com/bikebamburiti"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                        <a
                            href="https://wa.me/5561994951234"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                        >
                            <FontAwesomeIcon icon={faWhatsapp} />
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="YouTube"
                        >
                            <FontAwesomeIcon icon={faYoutube} />
                        </a>
                    </div>
                </div>

                {/* Coluna 2: Mapa do Site */}
                <div className="footer-column">
                    <h3 className="footer-title">Mapa do Site</h3>
                    <ul className="footer-nav">
                        <li><a href="#home">Início</a></li>
                        <li><a href="#bikes">Modelos de Bikes</a></li>
                        <li><a href="#sharing">Bike Sharing</a></li>
                        <li><a href="#contato">Fale Conosco</a></li>
                    </ul>
                </div>

                {/* Coluna 3: Contatos e Localização */}
                <div className="footer-column">
                    <h3 className="footer-title">Onde Estamos</h3>
                    <p className="footer-info">Planaltina - GO / DF</p>
                    <p className="footer-info">Secreta, 1065 - Lagoa Formosa</p>
                    <p className="footer-info">contato@bamburiti.com.br</p>
                    <p className="footer-info">(61) 99495-1234</p>
                </div>

            </div>

            <div className="footer-bottom">
                <div className="footer-divider"></div>
                <p className="footer-copy"> {/* Adicionei a classe aqui */}
                    © 2026 Bamburiti. Todos os direitos reservados.
                    <span className="footer-authors"> Jakeline Honório, Lucas Nunes e Wilson de Brito  </span> 
                </p>
            </div>
        </footer>
    );
};

export default Footer;
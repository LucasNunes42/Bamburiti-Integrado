import React from 'react';
import './Sobre.css';
import fotoVitor from '../assets/img/vitor-bamburiti.jpg'; // 🆕 Sua nova imagem de estúdio

export default function Sobre() {
  return (
    <div className="sobre-container">
      
      {/* SEÇÃO 1: HERO / INTRODUÇÃO */}
      <section className="sobre-hero">
        <div className="sobre-content-wrapper">
          <span className="sobre-tagline">Conheça a nossa jornada</span>
          <h1>A Essência da Bamburiti</h1>
          <p className="sobre-main-text">
            A Bamburiti nasceu da paixão pela arte e da motivação de associar o design moderno 
            a materiais naturais e sustentáveis, principalmente o bambu. Somos uma empresa de soluções 
            que trabalha com o desenvolvimento de projetos, tecnologias e produtos focados nos 
            preceitos da Agroecologia e Permacultura.
          </p>
        </div>
      </section>

      {/* SEÇÃO 2: FUNDADOR (Layout de duas colunas igual ao novo padrão) */}
      <section className="sobre-fundador">
        <div className="sobre-grid">
          <div className="fundador-imagem-container">
            <img src={fotoVitor} alt="Vitor Hugo - Fundador da Bamburiti" className="fundador-img" />
          </div>
          <div className="fundador-texto">
            <span className="sobre-tagline">Quem está à frente</span>
            <h2>Vitor Hugo Moraes de Lima</h2>
            <p>
              Nascido em Taguatinga - DF, Vitor é o coração criativo da Bamburiti. Acadêmico nas 
              ciências da agroecologia pelo Instituto Federal de Brasília (IFB) e com bagagem em 
              Engenharia Agrícola pela Universidade Federal do Pampa (UNIPAMPA - RS). 
            </p>
            <p>
              Sua trajetória une o olhar sensível do audiovisual com a força técnica do artesanato 
              construtor e do arte design em bambu, transformando ideias em estruturas vivas e ecológicas.
            </p>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: O PODER DO BAMBU (Estilizado como os cards modernos da Home) */}
      <section className="sobre-impacto">
        <div className="sobre-content-wrapper">
          <h2>Nosso Diferencial Sustentável</h2>
          <p className="impacto-sub">
            Nosso diferencial está na capacidade de transformar e inovar através de um elemento fundamental: o bambu.
          </p>
          
          <div className="impacto-cards-grid">
            <div className="impacto-card">
              <h3>Resistência de Aço</h3>
              <p>Muitas vezes invisível nas propriedades rurais, este vegetal possui uma resistência estrutural mecânica que se assemelha ao aço.</p>
            </div>

            <div className="impacto-card">
              <h3>Clima e Carbono</h3>
              <p>É o vegetal com maior índice de sequestro de carbono do planeta, superando em até três vezes o eucalipto no auxílio da regulação climática.</p>
            </div>

            <div className="impacto-card">
              <h3>Regeneração do Solo</h3>
              <p>Além de suas aplicações de design, o bambu atua diretamente como um excelente agente para a recuperação e regeneração de solos degradados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: CHAMADA PARA AÇÃO (CTA) */}
      <section className="sobre-cta">
        <div className="cta-box">
          <h2>Quer conhecer mais de perto?</h2>
          <p>
            Oferecemos soluções que vão desde o nosso famoso <strong>Bike Tour em Bicicletas de Bambu</strong>, 
            até Estruturas Rurais, projetos para Glamping, Sistemas de Aquaponia, Workshops e programas 
            de capacitação em Design.
          </p>
          <p className="cta-highlight">Acompanhe nosso trabalho nas redes sociais ou ligue para a gente!</p>
          <button className="btn-contato" onClick={() => window.location.href = '#contato'}>
            Descubra o Modo Bamburiti de Ser
          </button>
        </div>
      </section>

    </div>
  );
}
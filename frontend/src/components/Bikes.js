import React from 'react';
import './Bikes.css';

import bike01 from '../assets/img/bike01.png';
import bike02 from '../assets/img/bike02.png';
import bike03 from '../assets/img/bike03.png';
import bike04 from '../assets/img/bike04.png';

const Bikes = () => {
  const produtos = [
    {
      id: 1,
      nome: "Bamburiti Classic",
      descricao: "Design minimalista com geometria urbana, ideal para o dia a dia sustentável.",
      preco: "R$ 4.999,99",
      imagem: bike01
    },
    {
      id: 2,
      nome: "Bamburiti Sport",
      descricao: "Reforçada para trilhas leves, unindo a maleabilidade do bambu com alta performance.",
      preco: "R$ 5.499,99",
      imagem: bike02
    },
    {
      id: 3,
      nome: "Bamburiti City",
      descricao: "Conforto absoluto com acabamento artesanal em fibra de carbono e bambu.",
      preco: "R$ 4.799,99",
      imagem: bike03
    },
    {
      id: 4,
      nome: "Bamburiti Eco-Track",
      descricao: "Série limitada com detalhes em papel craft 240g resinado, uma peça de arte.",
      preco: "R$ 6.299,99",
      imagem: bike04
    }
  ];

  return (
    <section className="bikes-section">
      {/* Título adicionado conforme solicitado */}
      <h2 className="section-main-title">Nossas Bicicletas</h2>
      
      <div className="bikes-container">
        <div className="bikes-grid">
          {produtos.map((bike) => (
            <div key={bike.id} className="bike-card-premium">
              <div className="bike-image-box">
                <span className="badge-eco">100% Sustentável</span>
                <img src={bike.imagem} alt={bike.nome} className="bike-img-fluid" />
              </div>
              
              <div className="bike-content">
                <h3 className="bike-model-name">{bike.nome}</h3>
                <p className="bike-description-text">{bike.descricao}</p>
                
                <div className="bike-footer-price">
                  <span className="price-tag">{bike.preco}</span>
                  <button className="btn-buy-now">Comprar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Bikes;
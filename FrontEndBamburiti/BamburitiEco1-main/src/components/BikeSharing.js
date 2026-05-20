import React from 'react';
import './BikeSharing.css';
import imagemBike from '../assets/img/bikesharing.jpg'; 

const BikeSharing = () => {
  return (
    <section className="bikesharing-section">
      <div 
        className="bikesharing-container" 
        style={{ backgroundImage: `url(${imagemBike})` }}
      >
        <div className="bikesharing-content">
          <h2 className="bikesharing-title">Bike Sharing</h2>
          <p className="bikesharing-text">
            A <strong>Bamburiti</strong> oferece uma alternativa de transporte inovadora e ecológica. 
            Esse sistema permite que você alugue bicicletas feitas de bambu, 
            combinando a sustentabilidade do material com a praticidade do 
            compartilhamento. É uma maneira leve e consciente de se locomover, 
            contribuindo para cidades mais verdes e saudáveis.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BikeSharing;
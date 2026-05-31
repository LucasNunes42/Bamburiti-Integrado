import './Vantagens.css';
import img1 from '../assets/img/Vantagem01.webp';
import img2 from '../assets/img/Vantagem02.webp';
import img3 from '../assets/img/Vantagem03.webp';

export default function Vantagens() {
  return (
    <section className="vantagens-section">
      {/* Título preservado com a estilização original */}
      <h2 className="vantagens-title">
        Por que bicicleta de bambu?
      </h2>

      <div className="vantagens-container">
        
        {/* CARD 1 */}
        <div className="vantagem-card">
          <img src={img1} alt="Sustentabilidade" />
          <div className="card-content">
            <h3>Sustentabilidade</h3>
            <p>
              O bambu é um recurso altamente renovável e possui baixo impacto ambiental,
              sendo uma alternativa ecológica aos materiais tradicionais.
            </p>
          </div>
        </div>

        {/* CARD 2 */}
        <div className="vantagem-card">
          <img src={img2} alt="Resistência" />
          <div className="card-content">
            <h3>Leveza e Resistência</h3>
            <p>
              Estruturalmente eficiente, o bambu absorve impactos e proporciona
              uma pedalada mais confortável e estável.
            </p>
          </div>
        </div>

        {/* CARD 3 */}
        <div className="vantagem-card">
          <img src={img3} alt="Conforto" />
          <div className="card-content">
            <h3>Conforto e Estilo</h3>
            <p>
              Além do conforto, cada bicicleta possui estética única,
              com acabamento artesanal e identidade própria.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
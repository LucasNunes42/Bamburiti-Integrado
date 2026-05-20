import { useState, useEffect } from 'react';
import './Carousel.css';
import img1 from '../assets/img/carrossel-1comp.png';
import img2 from '../assets/img/carrossel-2comp.png';
import img3 from '../assets/img/carrossel-3comp.png';

const slides = [
  {
    imagem: img1,
    titulo: "Bicicleta de Bambu",
    subtitulo: (
      <>
        Ecologicamente correta e resistente.
      </>
    )
  },
  {
    imagem: img2,
    titulo: "Design em Bambu",
    subtitulo: "Leve, resistente e ecológico"
  },
  {
    imagem: img3,
    titulo: "Conecte-se à Natureza",
    subtitulo: "Pedale para um futuro melhor"
  }
];

export default function Carousel() {
  const [index, setIndex] = useState(0);

  const proximo = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const anterior = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(proximo, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div id="bambooBikeCarousel" className="carousel-container">

      <div className="carousel-inner">

        {slides.map((slide, i) => (
          <div
            key={i}
            className={`carousel-item ${i === index ? 'active' : ''}`}
          >
            <img
              src={slide.imagem}
              className="carousel-img"
              alt={slide.titulo}
            />

            <div className="custom-carousel-caption">
              <h1>{slide.titulo}</h1>
              <h2>{slide.subtitulo}</h2>
            </div>
          </div>
        ))}

      </div>

      {/* BOTÕES */}
      <button className="carousel-control-prev" onClick={anterior}>
        ‹
      </button>

      <button className="carousel-control-next" onClick={proximo}>
        ›
      </button>

      {/* INDICADORES EM LINHA */}
      <div className="carousel-indicators">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`indicator ${i === index ? 'active' : ''}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

    </div>
  );
}
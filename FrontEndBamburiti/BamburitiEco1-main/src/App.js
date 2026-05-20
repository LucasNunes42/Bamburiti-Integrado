import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout'; 
import Register from './components/Register'; 

// Componentes da Home 
import Carousel from "./components/Carousel";
import Vantagens from './components/Vantagens';
import BikeSharing from './components/BikeSharing';
import Bikes from './components/Bikes';

// Estilo Global
import "./assets/style.css";

// Agrupamento da Página Inicial
const Home = () => (
  <>
    <Carousel />
    <Vantagens />
    <BikeSharing />
    <Bikes />
  </>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<MainLayout />}>
          
          <Route index element={<Home />} />
          
          <Route path="registrar" element={<Register />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
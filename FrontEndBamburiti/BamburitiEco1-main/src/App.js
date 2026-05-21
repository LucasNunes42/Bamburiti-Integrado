import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout'; 
import Register from './components/Register'; 

// 🆕 IMPORTAÇÃO DAS NOVAS PÁGINAS (Verifique se o caminho das pastas está correto)
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';

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
        {/* Tudo o que estiver dentro de MainLayout ganha Header e Footer automaticamente! */}
        <Route path="/" element={<MainLayout />}>
          
          <Route index element={<Home />} />
          
          <Route path="registrar" element={<Register />} />

          {/* 🔗 Novas Rotas criadas aqui dentro */}
          <Route path="blog" element={<PostList />} />
          <Route path="admin/novo-post" element={<CreatePost />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
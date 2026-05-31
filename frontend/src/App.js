import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Register from './components/Register';

// IMPORTAÇÕES (Ajustadas para a versão final da Sprint 4)
import PostList from './components/PostList';
import PostDetails from './components/PostDetails';
import Login from './components/Login';
import Sobre from './components/Sobre';
import AdminDashboard from './components/AdminDashboard'; // 🆕 Importação do novo Painel Central

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

          {/* 🔗 Rotas do Blog e Institucional */}
          <Route path="blog" element={<PostList />} />
          <Route path="blog/:id" element={<PostDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="sobre" element={<Sobre />} />

          {/* ⚙️ ROTA CENTRAL DO ADMINISTRADOR */}
          <Route path="admin" element={<AdminDashboard />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Register from './components/Register';

<<<<<<< HEAD
// 🆕 IMPORTAÇÃO DAS NOVAS PÁGINAS (Verifique se o caminho das pastas está correto)
import PostList from './components/PostList';
import CreatePost from './components/CreatePost';
import PostDetails from './components/PostDetails';
import Login from './components/Login';
import Sobre from './components/Sobre';
=======
// IMPORTAÇÕES
import PostList from './components/PostList';
import PostDetails from './components/PostDetails';
import Login from './components/Login';
import Sobre from './components/Sobre';
import AdminDashboard from './components/AdminDashboard'; // 🆕 Importação do novo Painel Central
>>>>>>> 6305f9a2e700f1c77ec4c00536b4d39bb4df468f

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
<<<<<<< HEAD
        {/* Tudo o que estiver dentro de MainLayout ganha Header e Footer automaticamente! */}
        <Route path="/" element={<MainLayout />}>

          <Route index element={<Home />} />

          <Route path="registrar" element={<Register />} />

          {/* 🔗 Novas Rotas criadas aqui dentro */}
          <Route path="blog" element={<PostList />} />
          <Route path="admin/novo-post" element={<CreatePost />} />
          <Route path="/blog" element={<PostList />} />
          <Route path="/blog/:id" element={<PostDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="sobre" element={<Sobre />} />

=======
        <Route path="/" element={<MainLayout />}>

          <Route index element={<Home />} />
          <Route path="registrar" element={<Register />} />

          {/* 🔗 Rotas do Blog e Institucional */}
          <Route path="blog" element={<PostList />} />
          <Route path="blog/:id" element={<PostDetails />} />
          <Route path="login" element={<Login />} />
          <Route path="sobre" element={<Sobre />} />

          {/* ⚙️ ROTA CENTRAL DO ADMINISTRADOR */}
          {/* Substitui a rota antiga isolada "admin/novo-post" por esta completa */}
          <Route path="admin" element={<AdminDashboard />} />

>>>>>>> 6305f9a2e700f1c77ec4c00536b4d39bb4df468f
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
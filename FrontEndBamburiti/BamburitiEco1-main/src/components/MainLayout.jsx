import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ChatBot from './ChatBot'; // Importando a nova peça

const MainLayout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet /> {/* Aqui entram as páginas (Home, Register, etc.) */}
      </main>
      <Footer />
      <ChatBot /> {/* O ChatBot fica "flutuando" sobre o conteúdo */}
    </>
  );
};

export default MainLayout;
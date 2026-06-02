import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem('token');
  
  // 1. Se não houver token, o usuário nem sequer fez login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 2. Desembrulha o payload do JWT para verificar as permissões
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    
    // Supondo que você salvou o tipo de usuário dentro do JWT sob a chave 'role' ou 'tipo'
    const userRole = payload.role || localStorage.getItem('role'); 

    // 3. Se o cargo do usuário não for o exigido, barra o acesso
    if (roleRequired && userRole !== roleRequired) {
      alert("Acesso negado: Você não tem permissão para acessar esta página.");
      return <Navigate to="/" replace />;
    }
  } catch (error) {
    // Se o token estiver corrompido ou inválido, limpa e redireciona
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    return <Navigate to="/login" replace />;
  }

  // Se passou em todas as validações, renderiza o painel admin
  return children;
};

export default ProtectedRoute;
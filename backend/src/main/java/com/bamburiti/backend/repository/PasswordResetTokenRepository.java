package com.bamburiti.backend.repository;

import com.bamburiti.backend.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    
    Optional<PasswordResetToken> findByToken(String token);
    
    // Tem de ter exatamente este nome para bater com a alteração do Controller:
    void deleteByUsuarioIdUsuario(Long idUsuario); 
}
package com.bamburiti.backend.repository;

import com.bamburiti.backend.model.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    
    Optional<PasswordResetToken> findByToken(String token);
    
    @Modifying    // 👈 Avisa o Spring que isso vai alterar a tabela
    @Transactional // 👈 Abre a transação necessária para a exclusão funcionar
    void deleteByUsuarioIdUsuario(Long idUsuario); 
}
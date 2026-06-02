package com.bamburiti.backend.controller;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import com.bamburiti.backend.dto.DadosAutenticacao;
import com.bamburiti.backend.dto.DadosTokenJWT;
import com.bamburiti.backend.model.PasswordResetToken;
import com.bamburiti.backend.model.Usuario;
import com.bamburiti.backend.repository.PasswordResetTokenRepository;
import com.bamburiti.backend.repository.UsuarioRepository;
import com.bamburiti.backend.security.TokenService;
import org.springframework.beans.factory.annotation.Value;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager manager;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private UsuarioRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    // 🔑 Injeta o e-mail do remetente configurado nas propriedades
    @Value("${spring.mail.username}")
    private String emailRemetente;

    @PostMapping("/login")
    public ResponseEntity<?> efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        var token = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = manager.authenticate(token);

        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();
        var tokenJWT = tokenService.gerarToken(usuarioLogado);

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, usuarioLogado.getTipoUsuario()));
    }

    @PostMapping("/registrar")
    @Transactional
    public ResponseEntity<?> registrarConta(@RequestBody @Valid DadosAutenticacao dados) {
        if (repository.findByEmail(dados.email()) != null) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado no sistema!");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(dados.email());
        novoUsuario.setSenha(passwordEncoder.encode(dados.senha()));
        novoUsuario.setTipoUsuario("USER"); 
        novoUsuario.setEstaLogado(false);
        // ✂️ REMOVIDO: novoUsuario.setDataCadastro(...) -> O Hibernate gerencia automaticamente via @CreationTimestamp

        repository.save(novoUsuario);
        return ResponseEntity.ok().body("Conta criada com sucesso!");
    }

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody @Valid DadosSolicitacaoToken dados) {
        String email = dados.email();
        System.out.println("======> E-mail recebido do React: " + email);
        
        Usuario usuario = (Usuario) repository.findByEmail(email);
        
        if (usuario == null) {
            System.out.println("======> ALERTA: Usuário NÃO foi encontrado no banco de dados!");
            return ResponseEntity.ok("Se o e-mail existir no sistema, as instruções foram enviadas.");
        }

        System.out.println("======> Sucesso: Usuário encontrado! ID: " + usuario.getIdUsuario());
        
        tokenRepository.deleteByUsuarioIdUsuario(usuario.getIdUsuario());
        
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, usuario);
        tokenRepository.save(resetToken);

        String linkRecuperacao = "http://localhost:3000/nova-senha?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
        
        // 🛠️ É AQUI que deve colocar a injeção da variável ou o setFrom correspondente:
        message.setFrom(emailRemetente); 
        
        message.setTo(usuario.getEmail());
        message.setSubject("Bamburiti - Recuperação de Senha");
        message.setText("Olá!\n\nRecebemos uma solicitação para redefinir a senha da sua conta no sistema Bamburiti.\n"
                + "Clique no link abaixo para cadastrar uma nova senha:\n"
                + linkRecuperacao + "\n\n"
                + "Este link é válido por 1 hora.\nSe não foi você quem solicitou, pode ignorar esta mensagem.");

        mailSender.send(message);
        return ResponseEntity.ok("Instruções de recuperação enviadas com sucesso.");
    }
    @PostMapping("/reset-password")
    @Transactional
    public ResponseEntity<?> resetPassword(@RequestBody @Valid DadosRedefinicaoSenha dados) {
        var tokenOpt = tokenRepository.findByToken(dados.token());
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Token de recuperação inválido ou inexistente.");
        }

        PasswordResetToken resetToken = tokenOpt.get();

        if (resetToken.getDataExpiracao().isBefore(java.time.LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body("Este link de recuperação já expirou. Solicite um novo.");
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setSenha(passwordEncoder.encode(dados.novaSenha()));
        repository.save(usuario);

        // Deleta o token após o uso para que ele não possa ser reutilizado
        tokenRepository.delete(resetToken);
        return ResponseEntity.ok("Senha alterada com sucesso!");
    }
}

// =========================================================================
// 📄 DTOs (Records) Auxiliares para validação das requisições de senha
// =========================================================================

record DadosSolicitacaoToken(
    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "Formato de e-mail inválido")
    String email
) {}

record DadosRedefinicaoSenha(
    @NotBlank(message = "O token é obrigatório")
    String token,
    
    @NotBlank(message = "A nova senha não pode estar em branco")
    String novaSenha
) {}
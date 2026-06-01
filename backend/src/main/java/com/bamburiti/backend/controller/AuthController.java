package com.bamburiti.backend.controller;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.Map;
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

    @PostMapping("/login")
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        var token = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = manager.authenticate(token);

        // ✅ CORREÇÃO DO ERRO 1: Garante o mapeamento do objeto autenticado para a sua classe Usuario
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        var tokenJWT = tokenService.gerarToken(usuarioLogado);

        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, usuarioLogado.getTipoUsuario()));
    }

    @PostMapping("/registrar")
    public ResponseEntity registrarConta(@RequestBody @Valid DadosAutenticacao dados) {
        if (repository.findByEmail(dados.email()) != null) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado no sistema!");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(dados.email());
        novoUsuario.setSenha(passwordEncoder.encode(dados.senha()));
        novoUsuario.setTipoUsuario("USER"); 
        novoUsuario.setEstaLogado(false);
        novoUsuario.setDataCadastro(LocalDateTime.now()); 

        repository.save(novoUsuario);
        return ResponseEntity.ok().body("Conta criada com sucesso!");
    }

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        
        // 🛠️ CORREÇÃO: Adicionado o (Usuario) para converter o UserDetails que o repository retorna
        Usuario usuario = (Usuario) repository.findByEmail(email);
        
        if (usuario == null) {
            return ResponseEntity.ok("Se o e-mail existir no sistema, as instruções foram enviadas.");
        }
        
        // Utilizando getIdUsuario() que está mapeado na sua classe Usuario
        tokenRepository.deleteByUsuarioIdUsuario(usuario.getIdUsuario());
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken(token, usuario);
        tokenRepository.save(resetToken);

        String linkRecuperacao = "http://localhost:3000/nova-senha?token=" + token;
        
        SimpleMailMessage message = new SimpleMailMessage();
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
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String novaSenha = request.get("novaSenha");

        var tokenOpt = tokenRepository.findByToken(token);
        if (tokenOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("Token de recuperação inválido ou inexistente.");
        }

        PasswordResetToken resetToken = tokenOpt.get();

        if (resetToken.getDataExpiracao().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            return ResponseEntity.badRequest().body("Este link de recuperação já expirou. Solicite um novo.");
        }

        Usuario usuario = resetToken.getUsuario();
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        repository.save(usuario);

        tokenRepository.delete(resetToken);
        return ResponseEntity.ok("Senha alterada com sucesso!");
    }
}
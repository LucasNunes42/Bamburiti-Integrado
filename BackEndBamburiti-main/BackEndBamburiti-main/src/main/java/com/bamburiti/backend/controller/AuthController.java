package com.bamburiti.backend.controller;

import jakarta.validation.Valid;
import java.time.LocalDateTime; // Importe necessário para a data de cadastro
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.bamburiti.backend.dto.DadosAutenticacao;
import com.bamburiti.backend.dto.DadosTokenJWT;
import com.bamburiti.backend.model.Usuario;
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

    @PostMapping("/login")
    public ResponseEntity efetuarLogin(@RequestBody @Valid DadosAutenticacao dados) {
        var token = new UsernamePasswordAuthenticationToken(dados.email(), dados.senha());
        var authentication = manager.authenticate(token);

        // 1. Pega o usuário autenticado
        Usuario usuarioLogado = (Usuario) authentication.getPrincipal();

        // 2. Gera o token normalmente
        var tokenJWT = tokenService.gerarToken(usuarioLogado);

        // 3. Devolve o TOKEN e o TIPO do usuário no JSON para ajudar o Front-end
        return ResponseEntity.ok(new DadosTokenJWT(tokenJWT, usuarioLogado.getTipoUsuario()));
    }

    @PostMapping("/registrar")
    public ResponseEntity registrarConta(@RequestBody @Valid DadosAutenticacao dados) {

        if (repository.findByEmail(dados.email()) != null) {
            return ResponseEntity.badRequest().body("E-mail já cadastrado no sistema!");
        }

        // Instancia o novo usuário
        Usuario novoUsuario = new Usuario();
        novoUsuario.setEmail(dados.email());

        // Criptografa a senha antes de salvar
        String senhaCriptografada = passwordEncoder.encode(dados.senha());
        novoUsuario.setSenha(senhaCriptografada);

        // Define o nível de permissão padrão e status
        novoUsuario.setTipoUsuario("USER"); 
        novoUsuario.setEstaLogado(false);
        
        // CORREÇÃO: Preenche a data exigida como NOT NULL no banco de dados
        novoUsuario.setDataCadastro(LocalDateTime.now()); 

        // Salva no banco de dados
        repository.save(novoUsuario);

        // Retorna sucesso para o Front-end
        return ResponseEntity.ok().body("Conta criada com sucesso!");
    }
}
package com.bamburiti.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
<<<<<<< HEAD
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
=======
import org.springframework.http.ResponseEntity; // ADICIONADO
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping; // ADICIONADO
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable; // ADICIONADO
import org.springframework.web.bind.annotation.PutMapping; // ADICIONADO
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam; // ADICIONADO
>>>>>>> 6305f9a2e700f1c77ec4c00536b4d39bb4df468f
import org.springframework.web.bind.annotation.RestController;

import com.bamburiti.backend.model.Usuario;
import com.bamburiti.backend.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
<<<<<<< HEAD
public class UsuarioController {

	@Autowired
	private UsuarioRepository repository;

	@GetMapping
	public List<Usuario> listarTodos() {
		return repository.findAll();
	}
}
=======
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @GetMapping
    public List<Usuario> listarTodos() {
        return repository.findAll();
    }

    // --- NOVO MÉTODO: DELETAR USUÁRIO ---
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // --- NOVO MÉTODO: ALTERAR PERFIL (ADMIN/USER) ---
    @PutMapping("/{id}/alterar-perfil")
    public ResponseEntity<Usuario> alterarPerfil(@PathVariable Long id, @RequestParam String novoTipo) {
        var usuarioOpt = repository.findById(id);
        if (usuarioOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        var usuario = usuarioOpt.get();
        // Converte para MAIÚSCULO (ex: se enviar "admin", vira "ADMIN")
        usuario.setTipoUsuario(novoTipo.toUpperCase()); 
        repository.save(usuario);
        
        return ResponseEntity.ok(usuario);
    }
}
>>>>>>> 6305f9a2e700f1c77ec4c00536b4d39bb4df468f

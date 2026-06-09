package com.bamburiti.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bamburiti.backend.model.Usuario;
import com.bamburiti.backend.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

	@Autowired
	private UsuarioRepository repository;

	@GetMapping
	public List<Usuario> listarTodos() {
		return repository.findAll();
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletarUsuario(@PathVariable Long id) {
		if (!repository.existsById(id)) {
			return ResponseEntity.notFound().build();
		}
		repository.deleteById(id);
		return ResponseEntity.noContent().build();
	}

	@PutMapping("/{id}/alterar-perfil")
	public ResponseEntity<?> alterarPerfil(@PathVariable Long id, @RequestParam String novoTipo) {
		String tipoFormatado = novoTipo.toUpperCase();
		if (!tipoFormatado.equals("ADMIN") && !tipoFormatado.equals("USER")) {
			return ResponseEntity.badRequest().body("Tipo de usuário inválido! Use apenas 'ADMIN' ou 'USER'.");
		}

		var usuarioOpt = repository.findById(id);
		if (usuarioOpt.isEmpty()) {
			return ResponseEntity.notFound().build();
		}
		
		var usuario = usuarioOpt.get();
		usuario.setTipoUsuario(tipoFormatado); 
		repository.save(usuario);
		
		return ResponseEntity.ok(usuario);
	}
}
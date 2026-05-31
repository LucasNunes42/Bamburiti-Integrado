package com.bamburiti.backend.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

import com.bamburiti.backend.model.Post;
import com.bamburiti.backend.repository.PostRepository;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {

	@Autowired
	private PostRepository postRepository;

	// Define a pasta onde as imagens ficarão salvas no servidor
	private static final String CAMINHO_IMAGENS = "uploads/";

	@GetMapping
	public List<Post> listarTodos() {
		return postRepository.findAll();
	}

	@PostMapping(value = "/com-foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Post> criarPostComFoto(
			@RequestParam("titulo") String titulo,
			@RequestParam("conteudo") String conteudo,
			@RequestParam("autor") String autor,
			@RequestParam("arquivo") MultipartFile arquivo) {

		try {
			// 1. Criar a pasta "uploads" caso não exista
			File pasta = new File(CAMINHO_IMAGENS);
			if (!pasta.exists()) {
				pasta.mkdirs();
			}

			// 2. Extrair bytes e criar um nome único (evita imagens com mesmo nome)
			byte[] bytes = arquivo.getBytes();
			String nomeArquivo = System.currentTimeMillis() + "_" + arquivo.getOriginalFilename();
			Path caminho = Paths.get(CAMINHO_IMAGENS + nomeArquivo);

			// Salva fisicamente na máquina
			Files.write(caminho, bytes);

			// 3. Montar o Objeto e salvar no Banco de Dados
			Post novoPost = new Post();
			novoPost.setTitulo(titulo);
			novoPost.setConteudo(conteudo);
			novoPost.setAutor(autor);
			novoPost.setDataPublicacao(LocalDateTime.now());
			
			// Guarda o caminho que o Frontend usará para carregar a foto
			novoPost.setUrlImagem("/" + CAMINHO_IMAGENS + nomeArquivo);

			postRepository.save(novoPost);

			return new ResponseEntity<>(novoPost, HttpStatus.CREATED);

		} catch (IOException e) {
			e.printStackTrace();
			return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<Post> atualizarPost(
			@PathVariable Long id,
			@RequestParam("titulo") String titulo,
			@RequestParam("conteudo") String conteudo,
			@RequestParam("autor") String autor,
			@RequestParam(value = "arquivo", required = false) MultipartFile arquivo) {

		return postRepository.findById(id).map(postExistente -> {
			try {
				postExistente.setTitulo(titulo);
				postExistente.setConteudo(conteudo);
				postExistente.setAutor(autor);

				// Se o usuário enviou uma nova foto, atualiza o arquivo físico
				if (arquivo != null && !arquivo.isEmpty()) {
					// Remove a foto antiga se ela existir localmente
					if (postExistente.getUrlImagem() != null && postExistente.getUrlImagem().startsWith("/")) {
						String caminhoAntigo = postExistente.getUrlImagem().substring(1);
						Files.deleteIfExists(Paths.get(caminhoAntigo));
					}

					// Salva a nova foto
					byte[] bytes = arquivo.getBytes();
					String nomeArquivo = System.currentTimeMillis() + "_" + arquivo.getOriginalFilename();
					Path caminho = Paths.get(CAMINHO_IMAGENS + nomeArquivo);
					Files.write(caminho, bytes);
					postExistente.setUrlImagem("/" + CAMINHO_IMAGENS + nomeArquivo);
				}

				postRepository.save(postExistente);
				return ResponseEntity.ok(postExistente);

			} catch (IOException e) {
				e.printStackTrace();
				return new ResponseEntity<Post>(HttpStatus.INTERNAL_SERVER_ERROR);
			}
		}).orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deletarPost(@PathVariable Long id) {
		return postRepository.findById(id).map(post -> {
			// Tenta apagar o arquivo físico se ele existir
			if (post.getUrlImagem() != null && post.getUrlImagem().startsWith("/")) {
				try {
					// Remove a barra inicial do caminho para bater com a pasta local
					String caminhoLocal = post.getUrlImagem().substring(1);
					Files.deleteIfExists(Paths.get(caminhoLocal));
				} catch (IOException e) {
					// Log caso dê erro ao apagar o arquivo físico, sem travar a deleção no banco
					System.err.println("Não foi possível deletar o arquivo físico: " + e.getMessage());
				}
			}

			postRepository.deleteById(id);
			return ResponseEntity.noContent().<Void>build();
		}).orElse(ResponseEntity.notFound().build());
	}
}
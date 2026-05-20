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
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
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
	private static String CAMINHO_IMAGENS = "uploads/";

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
}
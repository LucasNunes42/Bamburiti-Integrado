package com.bamburiti.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bamburiti.backend.model.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
	// Aqui você não precisa escrever código, o JpaRepository já nos dá
	// save(), findAll(), findById(), deleteById() de graça.
}
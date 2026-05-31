package com.bamburiti.backend.security;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.bamburiti.backend.model.Usuario;

@Service
public class TokenService {

	// Essa é a senha secreta da sua API. (Em um projeto real, fica no
	// application.properties)
	private String secret = "senha-secreta-bamburiti-123";

	public String gerarToken(Usuario usuario) {
		try {
			Algorithm algoritmo = Algorithm.HMAC256(secret);
			return JWT.create().withIssuer("API Bamburiti").withSubject(usuario.getEmail()) // Guarda o email da pessoa
																							// no token
					.withExpiresAt(dataExpiracao()) // Token expira em 2 horas
					.sign(algoritmo);
		} catch (JWTCreationException exception) {
			throw new RuntimeException("Erro ao gerar token JWT", exception);
		}
	}

	private Instant dataExpiracao() {
		return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
	}

	public String getSubject(String tokenJWT) {
		try {
			var algoritmo = com.auth0.jwt.algorithms.Algorithm.HMAC256(secret);
			return com.auth0.jwt.JWT.require(algoritmo).withIssuer("API Bamburiti").build().verify(tokenJWT)
					.getSubject();
		} catch (com.auth0.jwt.exceptions.JWTVerificationException exception) {
			throw new RuntimeException("Token JWT inválido ou expirado!");
		}
	}
}
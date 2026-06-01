package com.bamburiti.backend.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;

@Configuration
@EnableWebSecurity
@OpenAPIDefinition(
    info = @Info(title = "Bamburiti API", version = "v1"), 
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
    name = "bearerAuth", 
    type = SecuritySchemeType.HTTP, 
    scheme = "bearer", 
    bearerFormat = "JWT"
)
public class SecurityConfig {

	@Autowired
	private SecurityFilter securityFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http
				.csrf(csrf -> csrf.disable())
				.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(req -> {
					// 🔓 Rotas Públicas (Autenticação, Leads e Documentação)
					req.requestMatchers(HttpMethod.POST, "/api/auth/registrar").permitAll();
					req.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll();
					req.requestMatchers("/api/leads/**").permitAll();
					req.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll();
					
					// Para a redefinicao de senha
					req.requestMatchers(HttpMethod.POST, "/api/auth/forgot-password").permitAll();
					req.requestMatchers(HttpMethod.POST, "/api/auth/reset-password").permitAll();

					// 🔓 Qualquer visitante pode ler os posts do Blog e ver imagens
					req.requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll();
					req.requestMatchers("/uploads/**").permitAll();

					// 🔐 Tranca do Administrador (Exige a autoridade "ADMIN")
					req.requestMatchers("/admin", "/admin/**", "/api/admin/**").hasRole("ADMIN");
					req.requestMatchers(HttpMethod.POST, "/api/posts/com-foto").hasRole("ADMIN");
					req.requestMatchers(HttpMethod.PUT, "/api/posts/**").hasRole("ADMIN"); 
					req.requestMatchers(HttpMethod.DELETE, "/api/posts/**").hasRole("ADMIN");
					req.requestMatchers("/api/usuarios", "/api/usuarios/**").hasRole("ADMIN");

					// 🔒 Qualquer outra requisição exige autenticação genérica
					req.anyRequest().authenticated();
				})
				.addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
				.build();
	}

	@Bean
	public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
		return configuration.getAuthenticationManager();
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
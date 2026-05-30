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
<<<<<<< HEAD
@OpenAPIDefinition(info = @Info(title = "Bamburiti API", version = "v1"), security = @SecurityRequirement(name = "bearerAuth") // Isso
																																// coloca
																																// o
																																// cadeado
																																// em
																																// todas
																																// as
																																// rotas
)
=======
@OpenAPIDefinition(info = @Info(title = "Bamburiti API", version = "v1"), security = @SecurityRequirement(name = "bearerAuth"))
>>>>>>> 6305f9a2e700f1c77ec4c00536b4d39bb4df468f
@SecurityScheme(name = "bearerAuth", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
public class SecurityConfig {
	@Autowired
	private SecurityFilter securityFilter;

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.csrf(csrf -> csrf.disable())
				.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(req -> {
					req.requestMatchers(HttpMethod.POST, "/api/auth/registrar").permitAll();
<<<<<<< HEAD
					req.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll(); // Libera o Login
					req.requestMatchers("/api/leads/**").permitAll(); // Libera o Chatbot/Leads
					req.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll();

					req.requestMatchers(HttpMethod.GET, "/api/posts").permitAll(); // Qualquer um lê os posts
					req.requestMatchers(HttpMethod.POST, "/api/posts/com-foto").permitAll(); // Libera o upload para
					req.requestMatchers("/uploads/**").permitAll();																			// testes// 
																								
					req.anyRequest().authenticated(); // Bloqueia todo o resto
=======
					req.requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll();
					req.requestMatchers("/api/leads/**").permitAll();
					req.requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll();

					// 🔓 Qualquer visitante pode ler os posts do Blog
					req.requestMatchers(HttpMethod.GET, "/api/posts/**").permitAll();
					req.requestMatchers("/uploads/**").permitAll();

					// 🔐 TRANCA DO ADMINISTRADOR (Exige a autoridade exata "ADMIN")
                    // Adicionamos as rotas literais de admin para que usuários comuns sejam barrados aqui
                    req.requestMatchers("/admin", "/admin/**", "/api/admin/**").hasRole("ADMIN");

					// 🔐 Bloqueios do Administrador (Exige o Token JWT com perfil ADMIN)
					req.requestMatchers(HttpMethod.POST, "/api/posts/com-foto").hasRole("ADMIN");
					req.requestMatchers(HttpMethod.PUT, "/api/posts/**").hasRole("ADMIN"); 
					req.requestMatchers(HttpMethod.DELETE, "/api/posts/**").hasRole("ADMIN");
					req.requestMatchers("/api/usuarios", "/api/usuarios/**").hasRole("ADMIN");

					req.anyRequest().authenticated();
>>>>>>> 6305f9a2e700f1c77ec4c00536b4d39bb4df468f
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
<<<<<<< HEAD
}
=======
}
>>>>>>> 6305f9a2e700f1c77ec4c00536b4d39bb4df468f

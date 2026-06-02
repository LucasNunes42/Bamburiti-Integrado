package com.bamburiti.backend.model;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "USUARIO")
public class Usuario implements UserDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idUsuario;

	// ✅ CORREÇÃO: Força o e-mail a ser único no banco e nunca nulo
	@Column(nullable = false, unique = true, length = 180)
	private String email; 

	// ✅ CORREÇÃO: Impede que a senha seja salva em branco
	@Column(nullable = false)
	private String senha;

	private String ultimoLogin;
	private Boolean estaLogado;
	private String tipoUsuario;
	@CreationTimestamp
	@Column(name = "data_cadastro", nullable = false, updatable = false)
	private LocalDateTime dataCadastro;

	// --- Getters e Setters ---

	public Long getIdUsuario() {
		return idUsuario;
	}

	public void setIdUsuario(Long idUsuario) {
		this.idUsuario = idUsuario;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getSenha() {
		return senha;
	}

	public void setSenha(String senha) {
		this.senha = senha;
	}

	public String getUltimoLogin() {
		return ultimoLogin;
	}

	public void setUltimoLogin(String ultimoLogin) {
		this.ultimoLogin = ultimoLogin;
	}

	public Boolean getEstaLogado() {
		return estaLogado;
	}

	public void setEstaLogado(Boolean estaLogado) {
		this.estaLogado = estaLogado;
	}

	public String getTipoUsuario() {
		return tipoUsuario;
	}

	public void setTipoUsuario(String tipoUsuario) {
		this.tipoUsuario = tipoUsuario;
	}

	public LocalDateTime getDataCadastro() { 
		return dataCadastro; 
	}
	
	public void setDataCadastro(LocalDateTime dataCadastro) { 
		this.dataCadastro = dataCadastro; 
	}

	// --- NOVOS MÉTODOS DO SPRING SECURITY (OBRIGATÓRIOS) ---

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		// Retorna a autoridade exata baseada no campo 'tipoUsuario'
		// Se tipoUsuario for nulo, define como USER por padrão
		String role = (tipoUsuario != null) ? tipoUsuario : "USER";
		
		// ✅ CORREÇÃO: Removido o "ROLE_", agora retorna exatamente "ADMIN" ou "USER"
		return List.of(new SimpleGrantedAuthority(role));
	}

	@Override
	public String getPassword() {
		return this.senha;
	}

	@Override
	public String getUsername() {
		return this.email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}
}
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
public class Usuario implements UserDetails { // Adicionado o "implements UserDetails"

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long idUsuario;

	private String email; 
	private String senha;
	private String ultimoLogin;
	private Boolean estaLogado;
	private String tipoUsuario;

	@CreationTimestamp
	@Column(name = "data_cadastro", nullable = false, updatable = false)
    private LocalDateTime dataCadastro;


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
		// Retorna a autoridade baseada no seu campo 'tipoUsuario'
		// Se tipoUsuario for nulo, define como ROLE_USER por padrão
		String role = (tipoUsuario != null) ? tipoUsuario : "USER";
		return List.of(new SimpleGrantedAuthority("ROLE_" + role));
	}

	@Override
	public String getPassword() {
		// O Spring Security precisa saber qual variável é a senha
		return this.senha;
	}

	@Override
	public String getUsername() {
		// O Spring Security precisa saber qual variável é o login (o email)
		return this.email;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true; // Conta não expirada
	}

	@Override
	public boolean isAccountNonLocked() {
		return true; // Conta não bloqueada
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true; // Senha não expirada
	}

	@Override
	public boolean isEnabled() {
		return true; // Usuário ativo
	}
}

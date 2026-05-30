package com.bamburiti.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "LEADS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Lead {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String nome;
	private String email;
	@Column(columnDefinition = "TEXT")
	private String texto;
<<<<<<< HEAD
=======
	@Column(name = "data_criacao", nullable = false)
	private java.time.LocalDateTime dataCriacao = java.time.LocalDateTime.now();
>>>>>>> 6305f9a2e700f1c77ec4c00536b4d39bb4df468f
}
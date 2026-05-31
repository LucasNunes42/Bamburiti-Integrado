package com.bamburiti.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record DadosCadastroPost(
    @NotBlank String titulo,
    @NotBlank String urlImagem,
    @NotBlank String conteudo
) {}

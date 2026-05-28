package com.bamburiti.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TesteController {

    @GetMapping("/api/status")
    public String verificarStatus() {
        return "Backend Bamburiti online e operante!";
    }
}

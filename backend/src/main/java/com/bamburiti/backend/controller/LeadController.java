package com.bamburiti.backend.controller;

import java.util.List; // 👈 Adicionamos a importação de List
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bamburiti.backend.model.Lead;
import com.bamburiti.backend.repository.LeadRepository;

@CrossOrigin(origins = "*", maxAge = 3600) 
@RestController
@RequestMapping("/api/leads")
public class LeadController {

    @Autowired
    private LeadRepository repository;

    // 📝 1. SALVAR LEAD (Você já tinha este, perfeito!)
    @PostMapping
    public ResponseEntity<Lead> capturarLead(@RequestBody Lead lead) {
        Lead leadSalvo = repository.save(lead);
        return ResponseEntity.status(HttpStatus.CREATED).body(leadSalvo);
    }

    // 📥 2. LISTAR LEADS (O que faltava para a tabela carregar)
    @GetMapping
    public ResponseEntity<List<Lead>> listarLeads() {
        List<Lead> leads = repository.findAll();
        return ResponseEntity.ok(leads);
    }

    // 🗑️ 3. DELETAR LEAD (Para o botão da lixeira no Front-end funcionar)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarLead(@PathVariable Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}

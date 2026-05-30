package com.bamburiti.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.bamburiti.backend.model.Lead;
import com.bamburiti.backend.repository.LeadRepository;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/leads")
public class LeadController {

    @Autowired
    private LeadRepository repository;

    @PostMapping
    public ResponseEntity<Lead> capturarLead(@RequestBody Lead lead) {
        Lead leadSalvo = repository.save(lead);
        return ResponseEntity.status(HttpStatus.CREATED).body(leadSalvo);
    }
}

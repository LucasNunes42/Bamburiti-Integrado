package com.bamburiti.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bamburiti.backend.model.Lead;

public interface LeadRepository extends JpaRepository<Lead, Long> {
}

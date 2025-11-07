package com.ClassCraft.site.repository;

import com.ClassCraft.site.models.SousModule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SousModuleRepository extends JpaRepository<SousModule, Long> {
}


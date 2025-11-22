package com.ClassCraft.site.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ClassCraft.site.models.Major;

@Repository
public interface MajorRepository extends JpaRepository<Major, Long> {
}


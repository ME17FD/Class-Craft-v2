package com.ClassCraft.site.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ClassCraft.site.dto.salle.SalleDto;
import com.ClassCraft.site.dto.salle.SalleRequestDto;
import com.ClassCraft.site.models.Salle;

public interface SalleService extends CrudService<Salle, Long> {
    Page<SalleDto> findAllPaged(Pageable pageable);
    SalleDto findByIdAsDto(Long id);
    SalleDto create(SalleRequestDto requestDto);
    SalleDto update(Long id, SalleRequestDto requestDto);
}


package com.ClassCraft.site.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ClassCraft.site.dto.sousmodule.SousModuleDto;
import com.ClassCraft.site.dto.sousmodule.SousModuleRequestDto;
import com.ClassCraft.site.models.SousModule;

public interface SousModuleService extends CrudService<SousModule, Long> {
    Page<SousModuleDto> findAllPaged(Pageable pageable);
    SousModuleDto findByIdAsDto(Long id);
    SousModuleDto create(SousModuleRequestDto requestDto);
    SousModuleDto update(Long id, SousModuleRequestDto requestDto);
}


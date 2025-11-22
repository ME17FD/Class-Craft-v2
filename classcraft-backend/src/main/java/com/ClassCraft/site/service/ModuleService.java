package com.ClassCraft.site.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ClassCraft.site.dto.module.ModuleDto;
import com.ClassCraft.site.dto.module.ModuleRequestDto;
import com.ClassCraft.site.models.Module;

public interface ModuleService extends CrudService<Module, Long> {
    Page<ModuleDto> findAllPaged(Pageable pageable);
    ModuleDto findByIdAsDto(Long id);
    ModuleDto create(ModuleRequestDto requestDto);
    ModuleDto update(Long id, ModuleRequestDto requestDto);
}


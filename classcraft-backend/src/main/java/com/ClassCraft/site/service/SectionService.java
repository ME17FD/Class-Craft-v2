package com.ClassCraft.site.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ClassCraft.site.dto.section.SectionDto;
import com.ClassCraft.site.dto.section.SectionRequestDto;
import com.ClassCraft.site.models.Section;

public interface SectionService extends CrudService<Section, Long> {
    Page<SectionDto> findAllPaged(Pageable pageable);
    SectionDto findByIdAsDto(Long id);
    SectionDto create(SectionRequestDto requestDto);
    SectionDto update(Long id, SectionRequestDto requestDto);
}


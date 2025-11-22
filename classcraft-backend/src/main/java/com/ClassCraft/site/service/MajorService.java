package com.ClassCraft.site.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ClassCraft.site.dto.major.MajorDto;
import com.ClassCraft.site.dto.major.MajorRequestDto;
import com.ClassCraft.site.models.Major;

public interface MajorService extends CrudService<Major, Long> {
    Page<MajorDto> findAllPaged(Pageable pageable);
    MajorDto findByIdAsDto(Long id);
    MajorDto create(MajorRequestDto requestDto);
    MajorDto update(Long id, MajorRequestDto requestDto);
}


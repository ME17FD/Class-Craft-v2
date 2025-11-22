package com.ClassCraft.site.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ClassCraft.site.dto.groupe.GroupeDto;
import com.ClassCraft.site.dto.groupe.GroupeRequestDto;
import com.ClassCraft.site.models.Groupe;

public interface GroupeService extends CrudService<Groupe, Long> {
    Page<GroupeDto> findAllPaged(Pageable pageable);
    GroupeDto findByIdAsDto(Long id);
    GroupeDto create(GroupeRequestDto requestDto);
    GroupeDto update(Long id, GroupeRequestDto requestDto);
}


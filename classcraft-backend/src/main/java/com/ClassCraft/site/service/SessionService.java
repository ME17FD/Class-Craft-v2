package com.ClassCraft.site.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.ClassCraft.site.dto.session.SessionDto;
import com.ClassCraft.site.dto.session.SessionRequestDto;
import com.ClassCraft.site.models.Session;

public interface SessionService extends CrudService<Session, Long> {
    Page<SessionDto> findAllPaged(Pageable pageable);
    SessionDto findByIdAsDto(Long id);
    SessionDto create(SessionRequestDto requestDto);
    SessionDto update(Long id, SessionRequestDto requestDto);
}


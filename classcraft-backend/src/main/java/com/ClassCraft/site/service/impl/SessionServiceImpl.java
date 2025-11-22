package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.dto.session.SessionDto;
import com.ClassCraft.site.dto.session.SessionRequestDto;
import com.ClassCraft.site.models.Session;
import com.ClassCraft.site.repository.SessionRepository;
import com.ClassCraft.site.service.SessionService;

@Service
public class SessionServiceImpl extends AbstractCrudService<Session, Long> implements SessionService {

    private final SessionRepository sessionRepository;

    public SessionServiceImpl(SessionRepository repository) {
        super(repository);
        this.sessionRepository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SessionDto> findAllPaged(Pageable pageable) {
        Page<Session> sessionsPage = sessionRepository.findAll(pageable);
        List<SessionDto> sessionDtos = sessionsPage.getContent().stream()
                .map(session -> new SessionDto(
                        session.getId(),
                        session.getName(),
                        session.getStartDate(),
                        session.getEndDate()
                ))
                .collect(Collectors.toList());
        return new PageImpl<>(sessionDtos, pageable, sessionsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public SessionDto findByIdAsDto(Long id) {
        return findById(id)
                .map(session -> new SessionDto(
                        session.getId(),
                        session.getName(),
                        session.getStartDate(),
                        session.getEndDate()
                ))
                .orElse(null);
    }

    @Override
    @Transactional
    public SessionDto create(SessionRequestDto requestDto) {
        Session session = new Session();
        session.setName(requestDto.name());
        session.setStartDate(requestDto.startDate());
        session.setEndDate(requestDto.endDate());
        Session savedSession = save(session);
        return new SessionDto(
                savedSession.getId(),
                savedSession.getName(),
                savedSession.getStartDate(),
                savedSession.getEndDate()
        );
    }

    @Override
    @Transactional
    public SessionDto update(Long id, SessionRequestDto requestDto) {
        return findById(id)
                .map(existingSession -> {
                    existingSession.setName(requestDto.name());
                    existingSession.setStartDate(requestDto.startDate());
                    existingSession.setEndDate(requestDto.endDate());
                    existingSession.setId(id);
                    Session updatedSession = save(existingSession);
                    return new SessionDto(
                            updatedSession.getId(),
                            updatedSession.getName(),
                            updatedSession.getStartDate(),
                            updatedSession.getEndDate()
                    );
                })
                .orElse(null);
    }
}


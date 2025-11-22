package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.dto.section.SectionDto;
import com.ClassCraft.site.dto.section.SectionRequestDto;
import com.ClassCraft.site.models.Major;
import com.ClassCraft.site.models.Section;
import com.ClassCraft.site.models.Session;
import com.ClassCraft.site.repository.MajorRepository;
import com.ClassCraft.site.repository.SectionRepository;
import com.ClassCraft.site.repository.SessionRepository;
import com.ClassCraft.site.service.SectionService;

@Service
public class SectionServiceImpl extends AbstractCrudService<Section, Long> implements SectionService {

    private final SectionRepository sectionRepository;
    private final MajorRepository majorRepository;
    private final SessionRepository sessionRepository;

    public SectionServiceImpl(SectionRepository repository,
                            MajorRepository majorRepository, SessionRepository sessionRepository) {
        super(repository);
        this.sectionRepository = repository;
        this.majorRepository = majorRepository;
        this.sessionRepository = sessionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SectionDto> findAllPaged(Pageable pageable) {
        Page<Section> sectionsPage = sectionRepository.findAll(pageable);
        List<SectionDto> sectionDtos = sectionsPage.getContent().stream()
                .map(section -> {
                    Long majorId = section.getMajor() != null ? section.getMajor().getId() : null;
                    Long sessionId = section.getSession() != null ? section.getSession().getId() : null;
                    return new SectionDto(
                            section.getId(),
                            section.getName(),
                            majorId,
                            sessionId
                    );
                })
                .collect(Collectors.toList());
        return new PageImpl<>(sectionDtos, pageable, sectionsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public SectionDto findByIdAsDto(Long id) {
        return findById(id)
                .map(section -> {
                    Long majorId = section.getMajor() != null ? section.getMajor().getId() : null;
                    Long sessionId = section.getSession() != null ? section.getSession().getId() : null;
                    return new SectionDto(
                            section.getId(),
                            section.getName(),
                            majorId,
                            sessionId
                    );
                })
                .orElse(null);
    }

    @Override
    @Transactional
    public SectionDto create(SectionRequestDto requestDto) {
        Section section = new Section();
        section.setName(requestDto.name());
        
        Major major = majorRepository.findById(requestDto.majorId())
                .orElseThrow(() -> new IllegalArgumentException("Major not found"));
        Session session = sessionRepository.findById(requestDto.sessionId())
                .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        
        section.setMajor(major);
        section.setSession(session);
        
        Section savedSection = save(section);
        return new SectionDto(
                savedSection.getId(),
                savedSection.getName(),
                savedSection.getMajor().getId(),
                savedSection.getSession().getId()
        );
    }

    @Override
    @Transactional
    public SectionDto update(Long id, SectionRequestDto requestDto) {
        return findById(id)
                .map(existingSection -> {
                    existingSection.setName(requestDto.name());
                    
                    Major major = majorRepository.findById(requestDto.majorId())
                            .orElseThrow(() -> new IllegalArgumentException("Major not found"));
                    Session session = sessionRepository.findById(requestDto.sessionId())
                            .orElseThrow(() -> new IllegalArgumentException("Session not found"));
                    
                    existingSection.setMajor(major);
                    existingSection.setSession(session);
                    existingSection.setId(id);
                    
                    Section updatedSection = save(existingSection);
                    return new SectionDto(
                            updatedSection.getId(),
                            updatedSection.getName(),
                            updatedSection.getMajor().getId(),
                            updatedSection.getSession().getId()
                    );
                })
                .orElse(null);
    }
}


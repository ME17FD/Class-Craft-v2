package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.dto.groupe.GroupeDto;
import com.ClassCraft.site.dto.groupe.GroupeRequestDto;
import com.ClassCraft.site.models.Groupe;
import com.ClassCraft.site.models.Section;
import com.ClassCraft.site.repository.GroupeRepository;
import com.ClassCraft.site.repository.SectionRepository;
import com.ClassCraft.site.service.GroupeService;

@Service
public class GroupeServiceImpl extends AbstractCrudService<Groupe, Long> implements GroupeService {

    private final GroupeRepository groupeRepository;
    private final ModelMapper modelMapper;
    private final SectionRepository sectionRepository;

    public GroupeServiceImpl(GroupeRepository repository, ModelMapper modelMapper,
                           SectionRepository sectionRepository) {
        super(repository);
        this.groupeRepository = repository;
        this.modelMapper = modelMapper;
        this.sectionRepository = sectionRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<GroupeDto> findAllPaged(Pageable pageable) {
        Page<Groupe> groupesPage = groupeRepository.findAll(pageable);
        List<GroupeDto> groupeDtos = groupesPage.getContent().stream()
                .map(groupe -> {
                    Long sectionId = groupe.getSection() != null ? groupe.getSection().getId() : null;
                    return new GroupeDto(
                            groupe.getId(),
                            groupe.getName(),
                            sectionId
                    );
                })
                .collect(Collectors.toList());
        return new PageImpl<>(groupeDtos, pageable, groupesPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public GroupeDto findByIdAsDto(Long id) {
        return findById(id)
                .map(groupe -> {
                    Long sectionId = groupe.getSection() != null ? groupe.getSection().getId() : null;
                    return new GroupeDto(
                            groupe.getId(),
                            groupe.getName(),
                            sectionId
                    );
                })
                .orElse(null);
    }

    @Override
    @Transactional
    public GroupeDto create(GroupeRequestDto requestDto) {
        Groupe groupe = new Groupe();
        groupe.setName(requestDto.name());
        
        Section section = sectionRepository.findById(requestDto.sectionId())
                .orElseThrow(() -> new IllegalArgumentException("Section not found"));
        groupe.setSection(section);
        
        Groupe savedGroupe = save(groupe);
        return new GroupeDto(
                savedGroupe.getId(),
                savedGroupe.getName(),
                savedGroupe.getSection().getId()
        );
    }

    @Override
    @Transactional
    public GroupeDto update(Long id, GroupeRequestDto requestDto) {
        return findById(id)
                .map(existingGroupe -> {
                    existingGroupe.setName(requestDto.name());
                    
                    Section section = sectionRepository.findById(requestDto.sectionId())
                            .orElseThrow(() -> new IllegalArgumentException("Section not found"));
                    existingGroupe.setSection(section);
                    existingGroupe.setId(id);
                    
                    Groupe updatedGroupe = save(existingGroupe);
                    return new GroupeDto(
                            updatedGroupe.getId(),
                            updatedGroupe.getName(),
                            updatedGroupe.getSection().getId()
                    );
                })
                .orElse(null);
    }
}


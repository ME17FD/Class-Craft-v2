package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.dto.module.ModuleDto;
import com.ClassCraft.site.dto.module.ModuleRequestDto;
import com.ClassCraft.site.models.Module;
import com.ClassCraft.site.models.Semestre;
import com.ClassCraft.site.models.User;
import com.ClassCraft.site.repository.ModuleRepository;
import com.ClassCraft.site.repository.SemestreRepository;
import com.ClassCraft.site.repository.UserRepository;
import com.ClassCraft.site.service.ModuleService;

@Service
public class ModuleServiceImpl extends AbstractCrudService<Module, Long> implements ModuleService {

    private final ModuleRepository moduleRepository;
    private final ModelMapper modelMapper;
    private final UserRepository userRepository;
    private final SemestreRepository semestreRepository;

    public ModuleServiceImpl(ModuleRepository repository, ModelMapper modelMapper,
                           UserRepository userRepository, SemestreRepository semestreRepository) {
        super(repository);
        this.moduleRepository = repository;
        this.modelMapper = modelMapper;
        this.userRepository = userRepository;
        this.semestreRepository = semestreRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ModuleDto> findAllPaged(Pageable pageable) {
        Page<Module> modulesPage = moduleRepository.findAll(pageable);
        List<ModuleDto> moduleDtos = modulesPage.getContent().stream()
                .map(module -> {
                    ModuleDto dto = modelMapper.map(module, ModuleDto.class);
                    Long professorId = module.getProfessor() != null ? module.getProfessor().getId() : null;
                    Long semestreId = module.getSemestre() != null ? module.getSemestre().getId() : null;
                    return new ModuleDto(
                            dto.id(),
                            dto.name(),
                            dto.code(),
                            dto.numberOfHours(),
                            professorId,
                            semestreId
                    );
                })
                .collect(Collectors.toList());
        return new PageImpl<>(moduleDtos, pageable, modulesPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public ModuleDto findByIdAsDto(Long id) {
        return findById(id)
                .map(module -> {
                    ModuleDto dto = modelMapper.map(module, ModuleDto.class);
                    Long professorId = module.getProfessor() != null ? module.getProfessor().getId() : null;
                    Long semestreId = module.getSemestre() != null ? module.getSemestre().getId() : null;
                    return new ModuleDto(
                            dto.id(),
                            dto.name(),
                            dto.code(),
                            dto.numberOfHours(),
                            professorId,
                            semestreId
                    );
                })
                .orElse(null);
    }

    @Override
    @Transactional
    public ModuleDto create(ModuleRequestDto requestDto) {
        Module module = modelMapper.map(requestDto, Module.class);
        
        User professor = userRepository.findById(requestDto.professorId())
                .orElseThrow(() -> new IllegalArgumentException("Professor not found"));
        Semestre semestre = semestreRepository.findById(requestDto.semestreId())
                .orElseThrow(() -> new IllegalArgumentException("Semester not found"));
        
        module.setProfessor(professor);
        module.setSemestre(semestre);
        
        Module savedModule = save(module);
        return new ModuleDto(
                savedModule.getId(),
                savedModule.getName(),
                savedModule.getCode(),
                savedModule.getNumberOfHours(),
                savedModule.getProfessor().getId(),
                savedModule.getSemestre().getId()
        );
    }

    @Override
    @Transactional
    public ModuleDto update(Long id, ModuleRequestDto requestDto) {
        return findById(id)
                .map(existingModule -> {
                    existingModule.setName(requestDto.name());
                    existingModule.setCode(requestDto.code());
                    existingModule.setNumberOfHours(requestDto.numberOfHours());
                    
                    User professor = userRepository.findById(requestDto.professorId())
                            .orElseThrow(() -> new IllegalArgumentException("Professor not found"));
                    Semestre semestre = semestreRepository.findById(requestDto.semestreId())
                            .orElseThrow(() -> new IllegalArgumentException("Semester not found"));
                    
                    existingModule.setProfessor(professor);
                    existingModule.setSemestre(semestre);
                    existingModule.setId(id);
                    
                    Module updatedModule = save(existingModule);
                    return new ModuleDto(
                            updatedModule.getId(),
                            updatedModule.getName(),
                            updatedModule.getCode(),
                            updatedModule.getNumberOfHours(),
                            updatedModule.getProfessor().getId(),
                            updatedModule.getSemestre().getId()
                    );
                })
                .orElse(null);
    }
}


package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.dto.sousmodule.SousModuleDto;
import com.ClassCraft.site.dto.sousmodule.SousModuleRequestDto;
import com.ClassCraft.site.models.Module;
import com.ClassCraft.site.models.SousModule;
import com.ClassCraft.site.models.User;
import com.ClassCraft.site.repository.ModuleRepository;
import com.ClassCraft.site.repository.SousModuleRepository;
import com.ClassCraft.site.repository.UserRepository;
import com.ClassCraft.site.service.SousModuleService;

@Service
public class SousModuleServiceImpl extends AbstractCrudService<SousModule, Long> implements SousModuleService {

    private final SousModuleRepository sousModuleRepository;
    private final ModuleRepository moduleRepository;
    private final UserRepository userRepository;

    public SousModuleServiceImpl(SousModuleRepository repository, ModuleRepository moduleRepository,
                                 UserRepository userRepository) {
        super(repository);
        this.sousModuleRepository = repository;
        this.moduleRepository = moduleRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SousModuleDto> findAllPaged(Pageable pageable) {
        Page<SousModule> sousModulesPage = sousModuleRepository.findAll(pageable);
        List<SousModuleDto> sousModuleDtos = sousModulesPage.getContent().stream()
                .map(sousModule -> new SousModuleDto(
                        sousModule.getId(),
                        sousModule.getName(),
                        sousModule.getNumberOfHours(),
                        sousModule.getModule() != null ? sousModule.getModule().getId() : null,
                        sousModule.getModule() != null ? sousModule.getModule().getName() : null,
                        sousModule.getProfessor() != null ? sousModule.getProfessor().getId() : null,
                        sousModule.getProfessor() != null ? 
                            (sousModule.getProfessor().getFirstName() + " " + sousModule.getProfessor().getLastName()).trim() : null
                ))
                .collect(Collectors.toList());
        return new PageImpl<>(sousModuleDtos, pageable, sousModulesPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public SousModuleDto findByIdAsDto(Long id) {
        return findById(id)
                .map(sousModule -> new SousModuleDto(
                        sousModule.getId(),
                        sousModule.getName(),
                        sousModule.getNumberOfHours(),
                        sousModule.getModule() != null ? sousModule.getModule().getId() : null,
                        sousModule.getModule() != null ? sousModule.getModule().getName() : null,
                        sousModule.getProfessor() != null ? sousModule.getProfessor().getId() : null,
                        sousModule.getProfessor() != null ? 
                            (sousModule.getProfessor().getFirstName() + " " + sousModule.getProfessor().getLastName()).trim() : null
                ))
                .orElse(null);
    }

    @Override
    @Transactional
    public SousModuleDto create(SousModuleRequestDto requestDto) {
        SousModule sousModule = new SousModule();
        sousModule.setName(requestDto.name());
        sousModule.setNumberOfHours(requestDto.numberOfHours());
        
        Module module = moduleRepository.findById(requestDto.moduleId())
                .orElseThrow(() -> new IllegalArgumentException("Module not found"));
        User professor = userRepository.findById(requestDto.professorId())
                .orElseThrow(() -> new IllegalArgumentException("Professor not found"));
        
        sousModule.setModule(module);
        sousModule.setProfessor(professor);
        
        SousModule savedSousModule = save(sousModule);
        return new SousModuleDto(
                savedSousModule.getId(),
                savedSousModule.getName(),
                savedSousModule.getNumberOfHours(),
                savedSousModule.getModule().getId(),
                savedSousModule.getModule().getName(),
                savedSousModule.getProfessor().getId(),
                (savedSousModule.getProfessor().getFirstName() + " " + savedSousModule.getProfessor().getLastName()).trim()
        );
    }

    @Override
    @Transactional
    public SousModuleDto update(Long id, SousModuleRequestDto requestDto) {
        return findById(id)
                .map(existingSousModule -> {
                    existingSousModule.setName(requestDto.name());
                    existingSousModule.setNumberOfHours(requestDto.numberOfHours());
                    
                    Module module = moduleRepository.findById(requestDto.moduleId())
                            .orElseThrow(() -> new IllegalArgumentException("Module not found"));
                    User professor = userRepository.findById(requestDto.professorId())
                            .orElseThrow(() -> new IllegalArgumentException("Professor not found"));
                    
                    existingSousModule.setModule(module);
                    existingSousModule.setProfessor(professor);
                    existingSousModule.setId(id);
                    
                    SousModule updatedSousModule = save(existingSousModule);
                    return new SousModuleDto(
                            updatedSousModule.getId(),
                            updatedSousModule.getName(),
                            updatedSousModule.getNumberOfHours(),
                            updatedSousModule.getModule().getId(),
                            updatedSousModule.getModule().getName(),
                            updatedSousModule.getProfessor().getId(),
                            (updatedSousModule.getProfessor().getFirstName() + " " + updatedSousModule.getProfessor().getLastName()).trim()
                    );
                })
                .orElse(null);
    }
}


package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.dto.salle.SalleDto;
import com.ClassCraft.site.dto.salle.SalleRequestDto;
import com.ClassCraft.site.models.Salle;
import com.ClassCraft.site.repository.SalleRepository;
import com.ClassCraft.site.service.SalleService;

@Service
public class SalleServiceImpl extends AbstractCrudService<Salle, Long> implements SalleService {

    private final SalleRepository salleRepository;

    public SalleServiceImpl(SalleRepository repository) {
        super(repository);
        this.salleRepository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SalleDto> findAllPaged(Pageable pageable) {
        Page<Salle> sallesPage = salleRepository.findAll(pageable);
        List<SalleDto> salleDtos = sallesPage.getContent().stream()
                .map(salle -> new SalleDto(
                        salle.getId(),
                        salle.getName(),
                        salle.getType(),
                        salle.getCapacity()
                ))
                .collect(Collectors.toList());
        return new PageImpl<>(salleDtos, pageable, sallesPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public SalleDto findByIdAsDto(Long id) {
        return findById(id)
                .map(salle -> new SalleDto(
                        salle.getId(),
                        salle.getName(),
                        salle.getType(),
                        salle.getCapacity()
                ))
                .orElse(null);
    }

    @Override
    @Transactional
    public SalleDto create(SalleRequestDto requestDto) {
        Salle salle = new Salle();
        salle.setName(requestDto.name());
        salle.setType(requestDto.type());
        salle.setCapacity(requestDto.capacity());
        Salle savedSalle = save(salle);
        return new SalleDto(
                savedSalle.getId(),
                savedSalle.getName(),
                savedSalle.getType(),
                savedSalle.getCapacity()
        );
    }

    @Override
    @Transactional
    public SalleDto update(Long id, SalleRequestDto requestDto) {
        return findById(id)
                .map(existingSalle -> {
                    existingSalle.setName(requestDto.name());
                    existingSalle.setType(requestDto.type());
                    existingSalle.setCapacity(requestDto.capacity());
                    existingSalle.setId(id);
                    Salle updatedSalle = save(existingSalle);
                    return new SalleDto(
                            updatedSalle.getId(),
                            updatedSalle.getName(),
                            updatedSalle.getType(),
                            updatedSalle.getCapacity()
                    );
                })
                .orElse(null);
    }
}


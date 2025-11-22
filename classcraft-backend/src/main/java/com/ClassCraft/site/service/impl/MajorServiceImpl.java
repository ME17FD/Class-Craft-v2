package com.ClassCraft.site.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.dto.major.MajorDto;
import com.ClassCraft.site.dto.major.MajorRequestDto;
import com.ClassCraft.site.models.Major;
import com.ClassCraft.site.repository.MajorRepository;
import com.ClassCraft.site.service.MajorService;

@Service
public class MajorServiceImpl extends AbstractCrudService<Major, Long> implements MajorService {

    private final MajorRepository majorRepository;

    public MajorServiceImpl(MajorRepository repository) {
        super(repository);
        this.majorRepository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MajorDto> findAllPaged(Pageable pageable) {
        Page<Major> majorsPage = majorRepository.findAll(pageable);
        List<MajorDto> majorDtos = majorsPage.getContent().stream()
                .map(major -> new MajorDto(
                        major.getId(),
                        major.getName(),
                        major.getDescription()
                ))
                .collect(Collectors.toList());
        return new PageImpl<>(majorDtos, pageable, majorsPage.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public MajorDto findByIdAsDto(Long id) {
        return findById(id)
                .map(major -> new MajorDto(
                        major.getId(),
                        major.getName(),
                        major.getDescription()
                ))
                .orElse(null);
    }

    @Override
    @Transactional
    public MajorDto create(MajorRequestDto requestDto) {
        Major major = new Major();
        major.setName(requestDto.name());
        major.setDescription(requestDto.description());
        Major savedMajor = save(major);
        return new MajorDto(
                savedMajor.getId(),
                savedMajor.getName(),
                savedMajor.getDescription()
        );
    }

    @Override
    @Transactional
    public MajorDto update(Long id, MajorRequestDto requestDto) {
        return findById(id)
                .map(existingMajor -> {
                    existingMajor.setName(requestDto.name());
                    existingMajor.setDescription(requestDto.description());
                    existingMajor.setId(id);
                    Major updatedMajor = save(existingMajor);
                    return new MajorDto(
                            updatedMajor.getId(),
                            updatedMajor.getName(),
                            updatedMajor.getDescription()
                    );
                })
                .orElse(null);
    }
}


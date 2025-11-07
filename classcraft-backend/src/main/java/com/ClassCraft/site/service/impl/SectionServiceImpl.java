package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.Section;
import com.ClassCraft.site.repository.SectionRepository;
import com.ClassCraft.site.service.SectionService;
import org.springframework.stereotype.Service;

@Service
public class SectionServiceImpl extends AbstractCrudService<Section, Long> implements SectionService {

    public SectionServiceImpl(SectionRepository repository) {
        super(repository);
    }
}


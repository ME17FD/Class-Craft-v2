package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.Semestre;
import com.ClassCraft.site.repository.SemestreRepository;
import com.ClassCraft.site.service.SemestreService;
import org.springframework.stereotype.Service;

@Service
public class SemestreServiceImpl extends AbstractCrudService<Semestre, Long> implements SemestreService {

    public SemestreServiceImpl(SemestreRepository repository) {
        super(repository);
    }
}


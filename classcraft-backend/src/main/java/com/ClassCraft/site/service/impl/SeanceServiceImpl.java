package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.Seance;
import com.ClassCraft.site.repository.SeanceRepository;
import com.ClassCraft.site.service.SeanceService;
import org.springframework.stereotype.Service;

@Service
public class SeanceServiceImpl extends AbstractCrudService<Seance, Long> implements SeanceService {

    public SeanceServiceImpl(SeanceRepository repository) {
        super(repository);
    }
}


package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.Salle;
import com.ClassCraft.site.repository.SalleRepository;
import com.ClassCraft.site.service.SalleService;
import org.springframework.stereotype.Service;

@Service
public class SalleServiceImpl extends AbstractCrudService<Salle, Long> implements SalleService {

    public SalleServiceImpl(SalleRepository repository) {
        super(repository);
    }
}


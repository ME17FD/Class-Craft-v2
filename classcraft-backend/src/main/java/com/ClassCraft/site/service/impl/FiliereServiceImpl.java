package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.Filiere;
import com.ClassCraft.site.repository.FiliereRepository;
import com.ClassCraft.site.service.FiliereService;
import org.springframework.stereotype.Service;

@Service
public class FiliereServiceImpl extends AbstractCrudService<Filiere, Long> implements FiliereService {

    public FiliereServiceImpl(FiliereRepository repository) {
        super(repository);
    }
}


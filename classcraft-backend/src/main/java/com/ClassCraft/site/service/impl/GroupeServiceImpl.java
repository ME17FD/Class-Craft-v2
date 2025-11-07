package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.Groupe;
import com.ClassCraft.site.repository.GroupeRepository;
import com.ClassCraft.site.service.GroupeService;
import org.springframework.stereotype.Service;

@Service
public class GroupeServiceImpl extends AbstractCrudService<Groupe, Long> implements GroupeService {

    public GroupeServiceImpl(GroupeRepository repository) {
        super(repository);
    }
}


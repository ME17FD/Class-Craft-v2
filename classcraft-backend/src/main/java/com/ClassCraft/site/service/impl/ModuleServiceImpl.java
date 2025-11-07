package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.Module;
import com.ClassCraft.site.repository.ModuleRepository;
import com.ClassCraft.site.service.ModuleService;
import org.springframework.stereotype.Service;

@Service
public class ModuleServiceImpl extends AbstractCrudService<Module, Long> implements ModuleService {

    public ModuleServiceImpl(ModuleRepository repository) {
        super(repository);
    }
}


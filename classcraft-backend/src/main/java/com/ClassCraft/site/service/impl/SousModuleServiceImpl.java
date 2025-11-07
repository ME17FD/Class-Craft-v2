package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.SousModule;
import com.ClassCraft.site.repository.SousModuleRepository;
import com.ClassCraft.site.service.SousModuleService;
import org.springframework.stereotype.Service;

@Service
public class SousModuleServiceImpl extends AbstractCrudService<SousModule, Long> implements SousModuleService {

    public SousModuleServiceImpl(SousModuleRepository repository) {
        super(repository);
    }
}


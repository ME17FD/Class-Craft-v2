package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.Session;
import com.ClassCraft.site.repository.SessionRepository;
import com.ClassCraft.site.service.SessionService;
import org.springframework.stereotype.Service;

@Service
public class SessionServiceImpl extends AbstractCrudService<Session, Long> implements SessionService {

    public SessionServiceImpl(SessionRepository repository) {
        super(repository);
    }
}


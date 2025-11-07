package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.User;
import com.ClassCraft.site.repository.UserRepository;
import com.ClassCraft.site.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends AbstractCrudService<User, Long> implements UserService {

    public UserServiceImpl(UserRepository repository) {
        super(repository);
    }
}


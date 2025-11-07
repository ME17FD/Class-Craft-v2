package com.ClassCraft.site.service.impl;

import com.ClassCraft.site.models.Reservation;
import com.ClassCraft.site.repository.ReservationRepository;
import com.ClassCraft.site.service.ReservationService;
import org.springframework.stereotype.Service;

@Service
public class ReservationServiceImpl extends AbstractCrudService<Reservation, Long> implements ReservationService {

    public ReservationServiceImpl(ReservationRepository repository) {
        super(repository);
    }
}


package com.ClassCraft.site.dto.session;

import java.time.LocalDate;

public record SessionDto(
        Long id,
        String name,
        LocalDate startDate,
        LocalDate endDate
) {
}


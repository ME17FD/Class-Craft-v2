package com.ClassCraft.site.dto.salle;

import com.ClassCraft.site.models.SalleType;

public record SalleDto(
        Long id,
        String name,
        SalleType type,
        int capacity
) {
}


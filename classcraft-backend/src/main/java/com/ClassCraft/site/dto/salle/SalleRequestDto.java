package com.ClassCraft.site.dto.salle;

import com.ClassCraft.site.models.SalleType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SalleRequestDto(
        @NotBlank(message = "Name is required")
        String name,
        
        @NotNull(message = "Type is required")
        SalleType type,
        
        @NotNull(message = "Capacity is required")
        @Positive(message = "Capacity must be positive")
        Integer capacity
) {
}


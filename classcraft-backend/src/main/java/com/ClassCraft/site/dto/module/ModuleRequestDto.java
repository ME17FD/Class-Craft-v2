package com.ClassCraft.site.dto.module;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ModuleRequestDto(
        @NotBlank(message = "Name is required")
        String name,
        
        @NotBlank(message = "Code is required")
        String code,
        
        @NotNull(message = "Number of hours is required")
        @Positive(message = "Number of hours must be positive")
        Integer numberOfHours,
        
        @NotNull(message = "Professor ID is required")
        Long professorId,
        
        @NotNull(message = "Semester ID is required")
        Long semestreId
) {
}


package com.ClassCraft.site.dto.sousmodule;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SousModuleRequestDto(
        @NotBlank(message = "Name is required")
        String name,
        
        @NotNull(message = "Number of hours is required")
        @Min(value = 1, message = "Number of hours must be at least 1")
        Integer numberOfHours,
        
        @NotNull(message = "Module ID is required")
        Long moduleId,
        
        @NotNull(message = "Professor ID is required")
        Long professorId
) {
}


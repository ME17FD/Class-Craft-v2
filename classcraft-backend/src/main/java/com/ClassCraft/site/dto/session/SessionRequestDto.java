package com.ClassCraft.site.dto.session;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SessionRequestDto(
        @NotBlank(message = "Name is required")
        String name,
        
        @NotNull(message = "Start date is required")
        LocalDate startDate,
        
        @NotNull(message = "End date is required")
        LocalDate endDate
) {
}


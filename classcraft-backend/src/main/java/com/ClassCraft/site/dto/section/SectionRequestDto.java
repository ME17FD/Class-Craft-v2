package com.ClassCraft.site.dto.section;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SectionRequestDto(
        @NotBlank(message = "Name is required")
        String name,
        
        @NotNull(message = "Major ID is required")
        Long majorId,
        
        @NotNull(message = "Session ID is required")
        Long sessionId
) {
}


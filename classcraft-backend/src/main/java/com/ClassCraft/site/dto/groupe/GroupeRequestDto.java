package com.ClassCraft.site.dto.groupe;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record GroupeRequestDto(
        @NotBlank(message = "Name is required")
        String name,
        
        @NotNull(message = "Section ID is required")
        Long sectionId
) {
}


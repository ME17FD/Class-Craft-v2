package com.ClassCraft.site.dto.major;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record MajorRequestDto(
        @NotBlank(message = "Name is required")
        String name,
        
        @Size(max = 500, message = "Description must not exceed 500 characters")
        String description
) {
}


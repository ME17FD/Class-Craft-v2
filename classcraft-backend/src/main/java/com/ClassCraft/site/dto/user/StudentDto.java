package com.ClassCraft.site.dto.user;

import com.ClassCraft.site.models.UserRole;

public record StudentDto(
        Long id,
        String email,
        String firstName,
        String lastName,
        UserRole role,
        Boolean approved,
        Long groupeId
) {
}


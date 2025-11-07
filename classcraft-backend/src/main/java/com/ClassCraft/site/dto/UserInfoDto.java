package com.ClassCraft.site.dto;

import com.ClassCraft.site.models.UserRole;

public record UserInfoDto(
        Long id,
        String email,
        UserRole role,
        boolean approved,
        Long groupeId) {
}


package com.ClassCraft.site.dto;

public record AuthResponse(
        UserInfoDto user,
        String tokenType,
        String accessToken,
        long accessTokenExpiresAt,
        String refreshToken,
        long refreshTokenExpiresAt) {
}


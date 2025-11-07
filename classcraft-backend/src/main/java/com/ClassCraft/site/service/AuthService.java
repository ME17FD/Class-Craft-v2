package com.ClassCraft.site.service;

import com.ClassCraft.site.dto.AuthResponse;
import com.ClassCraft.site.dto.LoginRequest;
import com.ClassCraft.site.dto.RefreshTokenRequest;
import com.ClassCraft.site.dto.UserInfoDto;
import com.ClassCraft.site.models.Groupe;
import com.ClassCraft.site.models.User;
import com.ClassCraft.site.repository.UserRepository;
import com.ClassCraft.site.security.JwtProvider;
import java.util.Date;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    public AuthService(AuthenticationManager authenticationManager,
            UserRepository userRepository,
            JwtProvider jwtProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
    }

    public AuthResponse authenticate(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        } catch (AuthenticationException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials", exception);
        }

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        ensureUserApproved(user);

        return buildAuthResponse(user);
    }

    public AuthResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.refreshToken();

        if (!jwtProvider.validateToken(refreshToken)
                || !jwtProvider.hasTokenType(refreshToken, JwtProvider.TokenType.REFRESH)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid refresh token");
        }

        String email = jwtProvider.getEmailFromJwt(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found"));

        ensureUserApproved(user);

        return buildAuthResponse(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtProvider.generateAccessToken(user);
        String refreshToken = jwtProvider.generateRefreshToken(user);

        long accessExpiry = toEpochMilli(jwtProvider.getExpirationDate(accessToken));
        long refreshExpiry = toEpochMilli(jwtProvider.getExpirationDate(refreshToken));

        return new AuthResponse(
                toUserInfoDto(user),
                "Bearer",
                accessToken,
                accessExpiry,
                refreshToken,
                refreshExpiry);
    }

    private void ensureUserApproved(User user) {
        if (!user.isApproved()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not approved");
        }
    }

    private UserInfoDto toUserInfoDto(User user) {
        Groupe groupe = user.getGroupe();
        Long groupeId = groupe != null ? groupe.getId() : null;
        return new UserInfoDto(user.getId(), user.getEmail(), user.getRole(), user.isApproved(), groupeId);
    }

    private long toEpochMilli(Date date) {
        return date.toInstant().toEpochMilli();
    }
}


package com.ClassCraft.site.security;

import com.ClassCraft.site.models.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;
import javax.crypto.SecretKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

@Component
public class JwtProvider {
    public enum TokenType {
        ACCESS,
        REFRESH
    }

    private static final Logger logger = LoggerFactory.getLogger(JwtProvider.class);
    private static final String TOKEN_TYPE_HEADER = "JWT";
    private static final String TOKEN_ISSUER = "classcraft-api";
    private static final String CLAIM_ROLE = "role";
    private static final String CLAIM_TOKEN_TYPE = "token_type";

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.access-expiration-ms:900000}")
    private long accessTokenExpirationMs;

    @Value("${jwt.refresh-expiration-ms:1209600000}")
    private long refreshTokenExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(User user) {
        return generateToken(user.getEmail(), user.getRole().name(), TokenType.ACCESS, accessTokenExpirationMs);
    }

    public String generateRefreshToken(User user) {
        return generateToken(user.getEmail(), user.getRole().name(), TokenType.REFRESH, refreshTokenExpirationMs);
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = parseClaims(token);
            return !isTokenExpired(claims);
        } catch (JwtException | IllegalArgumentException exception) {
            logger.warn("Invalid JWT token: {}", exception.getMessage());
            return false;
        }
    }

    public boolean validateToken(String token, UserDetails userDetails, TokenType expectedType) {
        if (!validateToken(token)) {
            return false;
        }
        final String email = getEmailFromJwt(token);
        if (!email.equals(userDetails.getUsername())) {
            return false;
        }
        return hasTokenType(token, expectedType);
    }

    public boolean hasTokenType(String token, TokenType expectedType) {
        String tokenType = getClaimFromToken(token, claims -> claims.get(CLAIM_TOKEN_TYPE, String.class));
        return tokenType != null && expectedType.name().equalsIgnoreCase(tokenType);
    }

    public String getEmailFromJwt(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public Date getExpirationDate(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = parseClaims(token);
        return claimsResolver.apply(claims);
    }

    private String generateToken(String email, String role, TokenType tokenType, long expirationMs) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setHeaderParam("typ", TOKEN_TYPE_HEADER)
                .setIssuer(TOKEN_ISSUER)
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .addClaims(Map.of(
                        CLAIM_ROLE, role,
                        CLAIM_TOKEN_TYPE, tokenType.name()))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(Claims claims) {
        Date expiration = claims.getExpiration();
        return expiration != null && expiration.before(new Date());
    }
}
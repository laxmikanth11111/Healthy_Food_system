package com.healthybite.app.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        jwtTokenProvider = new JwtTokenProvider("test-secret-key-for-jwt-token-provider-12345-abcdef1234567890-1234567890abcdef", 60_000L);
    }

    @Test
    void generateTokenShouldCreateTokenWithUserId() {
        Authentication authentication = new TestingAuthenticationToken(
                new UserPrincipal(42L, "user@example.com", "password", null),
                null
        );

        String token = jwtTokenProvider.generateToken(authentication);

        assertNotNull(token);
        assertFalse(token.isBlank());

        Claims claims = Jwts.parserBuilder()
                .setSigningKey("test-secret-key-for-jwt-token-provider-12345-abcdef1234567890-1234567890abcdef".getBytes())
                .build()
                .parseClaimsJws(token)
                .getBody();

        assertEquals("42", claims.getSubject());
    }

    @Test
    void getUserIdFromJWTShouldReturnUserIdFromToken() {
        Authentication authentication = new TestingAuthenticationToken(
                new UserPrincipal(77L, "user@example.com", "password", null),
                null
        );
        String token = jwtTokenProvider.generateToken(authentication);

        Long userId = jwtTokenProvider.getUserIdFromJWT(token);

        assertEquals(77L, userId);
    }

    @Test
    void validateTokenShouldReturnTrueForValidToken() {
        Authentication authentication = new TestingAuthenticationToken(
                new UserPrincipal(12L, "user@example.com", "password", null),
                null
        );
        String token = jwtTokenProvider.generateToken(authentication);

        assertTrue(jwtTokenProvider.validateToken(token));
    }

    @Test
    void validateTokenShouldReturnFalseForInvalidToken() {
        assertFalse(jwtTokenProvider.validateToken("not-a-valid-token"));
    }
}

package com.healthybite.app.security;

import com.healthybite.app.model.Role;
import com.healthybite.app.model.User;
import com.healthybite.app.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    @Test
    void loadUserByUsernameShouldReturnUserDetailsForExistingUser() {
        User user = new User("Test User", "user@example.com", "secret", Role.ROLE_USER);
        user.setId(1L);
        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserByUsername("user@example.com");

        assertNotNull(userDetails);
        assertEquals("user@example.com", userDetails.getUsername());
        assertEquals("secret", userDetails.getPassword());
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_USER")));
        verify(userRepository).findByEmail("user@example.com");
    }

    @Test
    void loadUserByUsernameShouldThrowWhenUserNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("missing@example.com")
        );

        assertTrue(exception.getMessage().contains("missing@example.com"));
        verify(userRepository).findByEmail("missing@example.com");
    }

    @Test
    void loadUserByIdShouldReturnUserDetailsForExistingUser() {
        User user = new User("Test User", "user@example.com", "secret", Role.ROLE_ADMIN);
        user.setId(2L);
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        UserDetails userDetails = userDetailsService.loadUserById(2L);

        assertNotNull(userDetails);
        assertEquals("user@example.com", userDetails.getUsername());
        assertTrue(userDetails.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")));
        verify(userRepository).findById(2L);
    }
}

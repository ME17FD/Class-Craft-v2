package com.ClassCraft.site.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ClassCraft.site.models.User;
import com.ClassCraft.site.models.UserRole;
import com.ClassCraft.site.repository.UserRepository;

@Component
public class AdminInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@classcraft.com}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    public AdminInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        userRepository.findByEmail(adminEmail)
                .ifPresentOrElse(
                        this::ensureAdminRole,
                        this::createDefaultAdmin);
    }

    private void ensureAdminRole(User user) {
        if (user.getRole() != UserRole.ADMIN || !user.isApproved()) {
            user.setRole(UserRole.ADMIN);
            user.setApproved(true);
            userRepository.save(user);
            logger.info("Updated existing user {} to have ADMIN role", adminEmail);
        } else {
            logger.info("Admin account already present with email {}", adminEmail);
        }
    }

    private void createDefaultAdmin() {
        User admin = new User();
        admin.setEmail(adminEmail);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setRole(UserRole.ADMIN);
        admin.setApproved(true);
        admin.setGroupe(null);
        userRepository.save(admin);
        logger.info("Created default admin account with email {}", adminEmail);
    }
}

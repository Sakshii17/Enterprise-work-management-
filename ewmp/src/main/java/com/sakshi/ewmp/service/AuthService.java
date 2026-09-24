package com.sakshi.ewmp.service;

import com.sakshi.ewmp.dto.LoginRequest;
import com.sakshi.ewmp.entity.User;
import com.sakshi.ewmp.repository.UserRepository;
import com.sakshi.ewmp.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public String login(LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmployeeId(request.getEmployeeId());

        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();
        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPassword());

        if (!matches) {
            return null;
        }

        return jwtUtil.generateToken(user.getEmployeeId(), user.getRole().getName());
    }
    public User getCurrentUser(String employeeId) {
    return userRepository.findByEmployeeId(employeeId).orElseThrow(() -> new RuntimeException("User not found"));
}
}
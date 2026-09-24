package com.sakshi.ewmp.controller;

import com.sakshi.ewmp.dto.LoginRequest;
import com.sakshi.ewmp.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = authService.login(request);

        if (token == null) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        return ResponseEntity.ok().body(new TokenResponse(token));
    }

    // Small inner class just to wrap the token in a clean JSON response
    static class TokenResponse {
        public String token;

        public TokenResponse(String token) {
            this.token = token;
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(org.springframework.security.core.Authentication authentication) {
    String employeeId = authentication.getName();
    return ResponseEntity.ok().body(authService.getCurrentUser(employeeId));
}
}
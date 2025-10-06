package com.example.labsampletracker.controller;

import com.example.labsampletracker.model.User;
import com.example.labsampletracker.repository.UserRepository;
import com.example.labsampletracker.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepo;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    public AuthController(UserRepository userRepo, JwtUtil jwtUtil) {

        this.userRepo = userRepo;
        this.jwtUtil = jwtUtil;

    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully"));

    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        User found = userRepo.findByUsername(user.getUsername());
        if (found != null && encoder.matches(user.getPassword(), found.getPassword())) {

            String token = jwtUtil.generateToken(found.getUsername());
            return ResponseEntity.ok(Map.of("token", token));

        }
        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));

    }

}



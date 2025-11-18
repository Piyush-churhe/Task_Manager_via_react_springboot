package com.taskmanager.controller;

import com.taskmanager.dto.JwtResponse;
import com.taskmanager.dto.LoginRequest;
import com.taskmanager.dto.RegisterRequest;
import com.taskmanager.entity.User;
import com.taskmanager.service.UserService;
import com.taskmanager.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "https://task-manager-via-react-springboot-7.onrender.com"})
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Optional<User> userOptional = userService.findByUsername(loginRequest.getUsername());

            if (!userOptional.isPresent()) {
                return ResponseEntity.badRequest().body("Invalid username or password");
            }

            User user = userOptional.get();

            if (!userService.validatePassword(loginRequest.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body("Invalid username or password");
            }

            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(new JwtResponse(token, user.getUsername()));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setPassword(registerRequest.getPassword());
            user.setEmail(registerRequest.getEmail());

            User savedUser = userService.registerUser(user);
            String token = jwtUtil.generateToken(savedUser.getUsername());

            return ResponseEntity.ok(new JwtResponse(token, savedUser.getUsername()));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed");
        }
    }
}
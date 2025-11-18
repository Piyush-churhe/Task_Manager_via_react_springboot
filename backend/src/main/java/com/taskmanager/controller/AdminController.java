package com.taskmanager.controller;

import com.taskmanager.dto.UserDto;
import com.taskmanager.entity.User;
import com.taskmanager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "https://task-manager-via-react-springboot-7.onrender.com"})
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<User> users = userService.findAllUsers();

        List<UserDto> result = users.stream()
                .map(u -> new UserDto(u.getId(), u.getUsername(), u.getEmail(), u.getRole()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.noContent().build();
    }
}



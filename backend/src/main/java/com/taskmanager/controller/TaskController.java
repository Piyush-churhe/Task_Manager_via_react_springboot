package com.taskmanager.controller;

import com.taskmanager.entity.Task;
import com.taskmanager.service.TaskService;
import com.taskmanager.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/tasks")
// CORS is handled globally in SecurityConfig
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private JwtUtil jwtUtil;

    private String getUsernameFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUsername(token);
        }
        return null;
    }

    @GetMapping
    public List<Task> getAllTasks(HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        return taskService.getTasksByUsername(username);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task, HttpServletRequest request) {
        String username = getUsernameFromRequest(request);
        task.setUsername(username);
        return taskService.saveTask(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task taskDetails,
                                           HttpServletRequest request) {
        String username = getUsernameFromRequest(request);

        Optional<Task> taskOptional = taskService.getTaskById(id);
        if (!taskOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Task task = taskOptional.get();
        if (!task.getUsername().equals(username)) {
            return ResponseEntity.status(403).build();
        }

        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        task.setCompleted(taskDetails.isCompleted());
        task.setDueDate(taskDetails.getDueDate());
        task.setPriority(taskDetails.getPriority());

        Task updatedTask = taskService.saveTask(task);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id, HttpServletRequest request) {
        String username = getUsernameFromRequest(request);

        Optional<Task> taskOptional = taskService.getTaskById(id);
        if (!taskOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Task task = taskOptional.get();
        if (!task.getUsername().equals(username)) {
            return ResponseEntity.status(403).build();
        }

        taskService.deleteTask(id);
        return ResponseEntity.ok().build();
    }
}
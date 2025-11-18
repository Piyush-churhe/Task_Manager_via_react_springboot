package com.taskmanager.service;

import com.taskmanager.entity.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private TaskService taskService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Check for tasks with deadlines in next 30 minutes
    @Scheduled(fixedRate = 60000) // Run every minute
    public void checkUpcomingDeadlines() {
        List<Task> allTasks = taskService.getAllTasks();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime threshold = now.plusMinutes(30);

        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");

        for (Task task : allTasks) {
            if (task.getDueDate() != null && task.getDueTime() != null && !task.isCompleted()) {
                try {
                    LocalDateTime taskDateTime = LocalDateTime.parse(
                            task.getDueDate() + "T" + task.getDueTime()
                    );

                    if (taskDateTime.isAfter(now) && taskDateTime.isBefore(threshold)) {
                        // Send notification
                        String message = String.format(
                                "Task '%s' is due in less than 30 minutes! (%s at %s)",
                                task.getTitle(),
                                task.getDueDate(),
                                task.getDueTime()
                        );

                        // Send to WebSocket (we'll set this up next)
                        messagingTemplate.convertAndSend("/topic/notifications/" + task.getUsername(),
                                new NotificationMessage("DEADLINE_SOON", message, task.getId()));
                    }
                } catch (Exception e) {
                    // Handle parsing errors
                    System.err.println("Error parsing date/time for task: " + task.getId());
                }
            }
        }
    }

    // Notification message class
    public static class NotificationMessage {
        private String type;
        private String message;
        private Long taskId;

        public NotificationMessage(String type, String message, Long taskId) {
            this.type = type;
            this.message = message;
            this.taskId = taskId;
        }

        // Getters and setters
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public Long getTaskId() { return taskId; }
        public void setTaskId(Long taskId) { this.taskId = taskId; }
    }
}
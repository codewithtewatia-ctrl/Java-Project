package com.projectflow.service;

import com.projectflow.dto.NotificationDto;
import com.projectflow.entity.Notification;
import com.projectflow.entity.User;
import com.projectflow.exception.ResourceNotFoundException;
import com.projectflow.repository.NotificationRepository;
import com.projectflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public NotificationDto createNotification(User user, String title, String message, String type) {
        Notification notification = new Notification(user, title, message, type);
        Notification saved = notificationRepository.save(notification);
        return new NotificationDto(saved);
    }

    @Transactional(readOnly = true)
    public List<NotificationDto> getUserNotifications(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(NotificationDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return notificationRepository.countByUserIdAndIsReadFalse(user.getId());
    }

    @Transactional
    public NotificationDto markAsRead(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        notification.setRead(true);
        Notification updated = notificationRepository.save(notification);
        return new NotificationDto(updated);
    }

    @Transactional
    public void markAllAsRead(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        for (Notification n : notifications) {
            n.setRead(true);
        }
        notificationRepository.saveAll(notifications);
    }
}

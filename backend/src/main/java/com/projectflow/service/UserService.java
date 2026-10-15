package com.projectflow.service;

import com.projectflow.dto.UserCreateRequest;
import com.projectflow.dto.UserDto;
import com.projectflow.dto.UserUpdateRequest;
import com.projectflow.entity.User;
import com.projectflow.entity.UserStatus;
import com.projectflow.exception.BadRequestException;
import com.projectflow.exception.ResourceNotFoundException;
import com.projectflow.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final NotificationService notificationService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return new UserDto(user);
    }

    @Transactional
    public UserDto createUser(UserCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User with email " + request.getEmail() + " already exists");
        }

        User user = new User(
                request.getName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole(),
                request.getStatus() != null ? request.getStatus() : UserStatus.ACTIVE
        );

        User savedUser = userRepository.save(user);

        notificationService.createNotification(savedUser, "Welcome to ProjectFlow", "Your account has been created by the administrator.", "SYSTEM");

        return new UserDto(savedUser);
    }

    @Transactional
    public UserDto updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

        if (StringUtils.hasText(request.getName())) {
            user.setName(request.getName());
        }

        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email " + request.getEmail() + " is already taken");
            }
            user.setEmail(request.getEmail());
        }

        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }

        if (request.getStatus() != null) {
            user.setStatus(request.getStatus());
        }

        User updatedUser = userRepository.save(user);
        return new UserDto(updatedUser);
    }

    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        userRepository.delete(user);
    }

    @Transactional
    public UserDto updateProfile(String userEmail, UserUpdateRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));

        if (StringUtils.hasText(request.getName())) {
            user.setName(request.getName());
        }

        if (StringUtils.hasText(request.getEmail()) && !request.getEmail().equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email " + request.getEmail() + " is already taken");
            }
            user.setEmail(request.getEmail());
        }

        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        User updatedUser = userRepository.save(user);
        notificationService.createNotification(updatedUser, "Profile Updated", "Your profile details have been successfully updated.", "PROFILE");
        return new UserDto(updatedUser);
    }
}

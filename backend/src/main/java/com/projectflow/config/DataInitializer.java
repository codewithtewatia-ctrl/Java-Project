package com.projectflow.config;

import com.projectflow.entity.*;
import com.projectflow.repository.*;
import com.projectflow.service.ProjectService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final NotificationRepository notificationRepository;
    private final SystemSettingRepository systemSettingRepository;
    private final PasswordEncoder passwordEncoder;
    private final ProjectService projectService;

    public DataInitializer(UserRepository userRepository,
                           ProjectRepository projectRepository,
                           TaskRepository taskRepository,
                           NotificationRepository notificationRepository,
                           SystemSettingRepository systemSettingRepository,
                           PasswordEncoder passwordEncoder,
                           ProjectService projectService) {
        this.userRepository = userRepository;
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
        this.notificationRepository = notificationRepository;
        this.systemSettingRepository = systemSettingRepository;
        this.passwordEncoder = passwordEncoder;
        this.projectService = projectService;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedData();
        }
    }

    private void seedData() {
        // 1. Seed Users
        User admin = userRepository.save(new User("System Admin", "admin@projectflow.com", passwordEncoder.encode("admin123"), Role.ADMIN, UserStatus.ACTIVE));
        User manager = userRepository.save(new User("Sarah Jenkins (PM)", "manager@projectflow.com", passwordEncoder.encode("manager123"), Role.PROJECT_MANAGER, UserStatus.ACTIVE));
        User dev = userRepository.save(new User("Alex Rivera (Dev)", "developer@projectflow.com", passwordEncoder.encode("dev123"), Role.TEAM_MEMBER, UserStatus.ACTIVE));
        User designer = userRepository.save(new User("Elena Rostova (UI/UX)", "designer@projectflow.com", passwordEncoder.encode("design123"), Role.TEAM_MEMBER, UserStatus.ACTIVE));
        User tester = userRepository.save(new User("David Chen (QA)", "tester@projectflow.com", passwordEncoder.encode("test123"), Role.TEAM_MEMBER, UserStatus.ACTIVE));

        // 2. Seed Projects
        Project p1 = new Project(
                "E-Commerce Platform",
                "Full-stack microservices based online retail platform with payment gateway integration and real-time inventory tracking.",
                LocalDate.now().minusDays(30),
                LocalDate.now().plusDays(45),
                ProjectStatus.ACTIVE,
                manager
        );
        p1.setTeamMembers(new HashSet<>(Arrays.asList(dev, designer, tester)));
        p1 = projectRepository.save(p1);

        Project p2 = new Project(
                "Mobile Banking Application",
                "Next-gen iOS and Android mobile app providing biometric authentication, fund transfers, and investment dashboards.",
                LocalDate.now().minusDays(15),
                LocalDate.now().plusDays(60),
                ProjectStatus.ACTIVE,
                manager
        );
        p2.setTeamMembers(new HashSet<>(Arrays.asList(dev, designer)));
        p2 = projectRepository.save(p2);

        Project p3 = new Project(
                "College Management System",
                "Enterprise ERP for student enrollment, faculty grading, timetable scheduling, and fee payment portals.",
                LocalDate.now().minusDays(60),
                LocalDate.now().minusDays(5),
                ProjectStatus.COMPLETED,
                manager
        );
        p3.setTeamMembers(new HashSet<>(Arrays.asList(dev, tester)));
        p3 = projectRepository.save(p3);

        Project p4 = new Project(
                "AI Chatbot Platform",
                "LLM-powered intelligent assistant for automated customer support and ticket routing.",
                LocalDate.now().plusDays(5),
                LocalDate.now().plusDays(90),
                ProjectStatus.PLANNING,
                manager
        );
        p4.setTeamMembers(new HashSet<>(List.of(dev)));
        p4 = projectRepository.save(p4);

        // 3. Seed Tasks
        // Project 1 Tasks
        taskRepository.save(new Task("Design Checkout Flow UI", "Create responsive Figma mockups for 3-step checkout workflow.", p1, designer, TaskPriority.HIGH, TaskStatus.COMPLETED, LocalDate.now().minusDays(25), LocalDate.now().minusDays(20)));
        taskRepository.save(new Task("Implement Stripe Payment Gateway", "Integrate Stripe API endpoints for card transactions and webhooks.", p1, dev, TaskPriority.URGENT, TaskStatus.IN_PROGRESS, LocalDate.now().minusDays(15), LocalDate.now().plusDays(5)));
        taskRepository.save(new Task("Automated E2E Payment Tests", "Write Cypress/Playwright regression tests for payment processing.", p1, tester, TaskPriority.MEDIUM, TaskStatus.TODO, LocalDate.now().minusDays(5), LocalDate.now().plusDays(12)));
        taskRepository.save(new Task("Product Catalog Database Indexing", "Optimize PostgreSQL indexes for product search queries.", p1, dev, TaskPriority.HIGH, TaskStatus.COMPLETED, LocalDate.now().minusDays(20), LocalDate.now().minusDays(10)));

        // Project 2 Tasks
        taskRepository.save(new Task("Biometric Authentication Setup", "Integrate FaceID and TouchID SDKs for mobile app login.", p2, dev, TaskPriority.URGENT, TaskStatus.IN_PROGRESS, LocalDate.now().minusDays(10), LocalDate.now().plusDays(10)));
        taskRepository.save(new Task("Design Dark Mode Color Palette", "Establish accessible high-contrast dark theme components.", p2, designer, TaskPriority.LOW, TaskStatus.COMPLETED, LocalDate.now().minusDays(12), LocalDate.now().minusDays(2)));
        taskRepository.save(new Task("Security Audit & Pen Testing", "Conduct vulnerability scan on auth tokens and SSL pinning.", p2, dev, TaskPriority.HIGH, TaskStatus.REVIEW, LocalDate.now().minusDays(8), LocalDate.now().plusDays(2)));
        taskRepository.save(new Task("Push Notification Gateway", "Setup Firebase Cloud Messaging for real-time transaction alerts.", p2, dev, TaskPriority.MEDIUM, TaskStatus.TODO, LocalDate.now().minusDays(2), LocalDate.now().plusDays(20)));

        // Project 3 Tasks (Completed Project)
        taskRepository.save(new Task("Student Portal Registration Module", "Build student signup form with email verification.", p3, dev, TaskPriority.HIGH, TaskStatus.COMPLETED, LocalDate.now().minusDays(55), LocalDate.now().minusDays(45)));
        taskRepository.save(new Task("Faculty Gradebook Export", "Allow professors to export PDF and Excel grade reports.", p3, dev, TaskPriority.MEDIUM, TaskStatus.COMPLETED, LocalDate.now().minusDays(40), LocalDate.now().minusDays(25)));
        taskRepository.save(new Task("Load Testing User Surge", "Perform JMeter load testing for 10,000 concurrent students.", p3, tester, TaskPriority.HIGH, TaskStatus.COMPLETED, LocalDate.now().minusDays(20), LocalDate.now().minusDays(10)));

        // Project 4 Tasks (Planning)
        taskRepository.save(new Task("AI Prompt Template Engineering", "Define structured prompt templates for customer intent resolution.", p4, dev, TaskPriority.HIGH, TaskStatus.TODO, LocalDate.now().plusDays(5), LocalDate.now().plusDays(18)));

        // 4. Update Project Progress Metrics
        projectService.updateProjectProgress(p1.getId());
        projectService.updateProjectProgress(p2.getId());
        projectService.updateProjectProgress(p3.getId());
        projectService.updateProjectProgress(p4.getId());

        // 5. Seed System Settings
        systemSettingRepository.save(new SystemSetting("APP_NAME", "ProjectFlow", "Application main title displayed across portal"));
        systemSettingRepository.save(new SystemSetting("DEFAULT_PROJECT_STATUS", "PLANNING", "Default status for newly initialized projects"));
        systemSettingRepository.save(new SystemSetting("DEFAULT_TASK_STATUS", "TODO", "Default status assigned to newly created tasks"));
        systemSettingRepository.save(new SystemSetting("EMAIL_NOTIFICATIONS_ENABLED", "true", "Enable system email notification alerts"));
        systemSettingRepository.save(new SystemSetting("ALLOW_USER_REGISTRATION", "true", "Allow self-registration for team members"));

        // 6. Seed Notifications
        notificationRepository.save(new Notification(admin, "System Initialization", "ProjectFlow system initialized successfully with sample data.", "SYSTEM"));
        notificationRepository.save(new Notification(manager, "Project Status Update", "E-Commerce Platform is currently 50% completed.", "PROJECT"));
        notificationRepository.save(new Notification(dev, "New Task Assignment", "You have been assigned to 'Implement Stripe Payment Gateway'.", "TASK"));
        notificationRepository.save(new Notification(designer, "Design Review Requested", "Checkout flow UI is ready for manager approval.", "TASK"));
    }
}

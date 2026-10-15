package com.projectflow.dto;

import com.projectflow.entity.Role;
import com.projectflow.entity.UserStatus;
import jakarta.validation.constraints.Email;

public class UserUpdateRequest {
    private String name;

    @Email(message = "Invalid email format")
    private String email;

    private String password;
    private Role role;
    private UserStatus status;

    public UserUpdateRequest() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }
}

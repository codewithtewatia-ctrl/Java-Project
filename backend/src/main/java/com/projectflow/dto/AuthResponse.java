package com.projectflow.dto;

import com.projectflow.entity.Role;
import com.projectflow.entity.UserStatus;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private Long id;
    private String name;
    private String email;
    private Role role;
    private UserStatus status;

    public AuthResponse() {
    }

    public AuthResponse(String token, Long id, String name, String email, Role role, UserStatus status) {
        this.token = token;
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

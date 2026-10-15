package com.projectflow.dto;

import com.projectflow.entity.SystemSetting;
import java.time.LocalDateTime;

public class SystemSettingDto {
    private Long id;
    private String settingKey;
    private String settingValue;
    private String description;
    private LocalDateTime updatedAt;

    public SystemSettingDto() {
    }

    public SystemSettingDto(SystemSetting setting) {
        if (setting != null) {
            this.id = setting.getId();
            this.settingKey = setting.getSettingKey();
            this.settingValue = setting.getSettingValue();
            this.description = setting.getDescription();
            this.updatedAt = setting.getUpdatedAt();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSettingKey() {
        return settingKey;
    }

    public void setSettingKey(String settingKey) {
        this.settingKey = settingKey;
    }

    public String getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(String settingValue) {
        this.settingValue = settingValue;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}

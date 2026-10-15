package com.projectflow.service;

import com.projectflow.dto.SystemSettingDto;
import com.projectflow.entity.SystemSetting;
import com.projectflow.exception.ResourceNotFoundException;
import com.projectflow.repository.SystemSettingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SystemSettingService {

    private final SystemSettingRepository settingRepository;

    public SystemSettingService(SystemSettingRepository settingRepository) {
        this.settingRepository = settingRepository;
    }

    @Transactional(readOnly = true)
    public List<SystemSettingDto> getAllSettings() {
        return settingRepository.findAll().stream()
                .map(SystemSettingDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public List<SystemSettingDto> updateSettings(Map<String, String> settingsMap) {
        for (Map.Entry<String, String> entry : settingsMap.entrySet()) {
            SystemSetting setting = settingRepository.findBySettingKey(entry.getKey())
                    .orElse(new SystemSetting(entry.getKey(), entry.getValue(), "System setting " + entry.getKey()));
            setting.setSettingValue(entry.getValue());
            settingRepository.save(setting);
        }
        return getAllSettings();
    }

    @Transactional
    public SystemSettingDto updateSingleSetting(String key, String value) {
        SystemSetting setting = settingRepository.findBySettingKey(key)
                .orElseThrow(() -> new ResourceNotFoundException("Setting", "key", key));
        setting.setSettingValue(value);
        return new SystemSettingDto(settingRepository.save(setting));
    }
}

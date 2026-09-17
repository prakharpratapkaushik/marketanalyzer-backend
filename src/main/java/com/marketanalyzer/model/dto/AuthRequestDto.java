package com.marketanalyzer.model.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AuthRequestDto {
    @NotBlank @Email
    private String email;
    @NotBlank @Size(min = 6, max = 128)
    private String password;
}

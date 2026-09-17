package com.marketanalyzer.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDto extends AuthRequestDto {
    @NotBlank @Size(max = 60)
    private String firstName;
    @NotBlank @Size(max = 60)
    private String lastName;
}

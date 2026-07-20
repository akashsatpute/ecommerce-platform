package com.ecommerce.authservice.dto.request;
import jakarta.validation.constraints.NotBlank;
public record PaymentPayRequest(@NotBlank String transactionId, @NotBlank String paymentMethod, String testOutcome) { }

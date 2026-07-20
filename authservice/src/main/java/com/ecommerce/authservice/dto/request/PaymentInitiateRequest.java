package com.ecommerce.authservice.dto.request;

import java.math.BigDecimal;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PaymentInitiateRequest(@Valid @NotNull Product product, @NotBlank String deliveryAddress) {
    public record Product(@NotBlank String name, @NotBlank String image, String description, @NotNull Integer quantity, @NotNull BigDecimal unitPrice) { }
}

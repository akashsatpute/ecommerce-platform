package com.ecommerce.cartservice.dto;

import java.math.BigDecimal;
import java.util.List;
import jakarta.validation.constraints.*;

public final class CartDtos {
	private CartDtos() {
	}
	public record Add(@NotNull Long productId, @NotBlank String productName, @NotBlank String productImage,
			@NotNull @Positive BigDecimal price, @NotNull @Positive Integer quantity) {
	}

	public record Quantity(@NotNull @Positive Integer quantity) {
	}

	public record Item(Long id, Long productId, String productName, String productImage, BigDecimal price,
			Integer quantity, BigDecimal subtotal) {
	}

	public record View(Long id, String status, BigDecimal totalAmount, List<Item> items) {
	}
}

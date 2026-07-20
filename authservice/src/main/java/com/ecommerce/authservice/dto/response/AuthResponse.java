package com.ecommerce.authservice.dto.response;

public record AuthResponse(String token,
		String username,
		String role
		) {}

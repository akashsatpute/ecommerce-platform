package com.ecommerce.cartservice.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.ecommerce.cartservice.dto.CartDtos.*;
import com.ecommerce.cartservice.service.CartApplicationService;

@RestController
@RequestMapping("/api/cart")
public class CartController {
	private final CartApplicationService service;

	public CartController(CartApplicationService s) {
		service = s;
	}

	private Long user(Authentication a) {
		return Long.valueOf(a.getName());
	}

	@PostMapping("/add")
	public View add(Authentication a, @Valid @RequestBody Add r) {
		return service.add(user(a), r);
	}

	@PutMapping("/update/{id}")
	public View update(Authentication a, @PathVariable Long id, @Valid @RequestBody Quantity r) {
		return service.update(user(a), id, r);
	}

	@DeleteMapping("/remove/{id}")
	public View remove(Authentication a, @PathVariable Long id) {
		return service.remove(user(a), id);
	}

	@DeleteMapping("/clear")
	public void clear(Authentication a) {
		service.clear(user(a));
	}

	@GetMapping
	public View get(Authentication a) {
		return service.get(user(a));
	}

	@GetMapping("/count")
	public int count(Authentication a) {
		return service.get(user(a)).items().stream().mapToInt(Item::quantity).sum();
	}

	@GetMapping("/total")
	public java.math.BigDecimal total(Authentication a) {
		return service.get(user(a)).totalAmount();
	}

	@PostMapping("/checkout")
	public View checkout(Authentication a) {
		return service.checkout(user(a));
	}
}

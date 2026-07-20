package com.ecommerce.authservice.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.authservice.dto.request.LoginRequest;
import com.ecommerce.authservice.dto.request.RegisterRequest;
import com.ecommerce.authservice.dto.response.ApiResponse;
import com.ecommerce.authservice.dto.response.AuthResponse;
import com.ecommerce.authservice.dto.response.UserDto;
import com.ecommerce.authservice.entity.User;
import com.ecommerce.authservice.repository.UserRepository;
import com.ecommerce.authservice.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
	private final AuthService authService;
	private final UserRepository repository;

	public AuthController(AuthService authService,UserRepository repository) {
		this.authService = authService;
		this.repository = repository;
	}

	@PostMapping("/register")
	public ResponseEntity<ApiResponse> register(@RequestBody RegisterRequest request) {

		authService.register(request);

		return ResponseEntity.ok(new ApiResponse("User Registered"));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
		System.out.println("indide login");
		return ResponseEntity.ok(authService.login(request));
	}

	@GetMapping("/me")
	public UserDto me(Authentication authentication) {

	    User user = repository.findByUsername(authentication.getName())
	            .orElseThrow();

	    return new UserDto(
	    		user.getId(),
	            user.getUsername(),
	    		user.getFirstName(),
	    		user.getLastName(),
	            user.getEmail(),
	            user.getRole().name()
	    );
	}
}

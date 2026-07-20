package com.ecommerce.authservice.service;

import java.security.Timestamp;
import java.time.LocalDateTime;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.authservice.dto.request.LoginRequest;
import com.ecommerce.authservice.dto.request.RegisterRequest;
import com.ecommerce.authservice.dto.response.AuthResponse;
import com.ecommerce.authservice.entity.User;
import com.ecommerce.authservice.enums.Role;
import com.ecommerce.authservice.repository.UserRepository;
import com.ecommerce.authservice.security.JwtService;

@Service
public class AuthService {

	private final UserRepository repository;
	private final PasswordEncoder encoder;
	private final AuthenticationManager authenticationManager;
	private final JwtService jwtService;

	public AuthService(UserRepository repository, PasswordEncoder encoder, AuthenticationManager authenticationManager,
			JwtService jwtService) {
		this.repository = repository;
		this.encoder = encoder;
		this.authenticationManager = authenticationManager;
		this.jwtService = jwtService;
	}

	public void register(RegisterRequest request) {

		User user = new User();
		user.setFirstName(request.firstname());
		user.setLastName(request.lastname());
		user.setUsername(request.username());
		user.setEmail(request.email());
		user.setPassword(encoder.encode(request.password()));
		user.setRole(Role.ROLE_USER);
		user.setUserCreationTime(LocalDateTime.now());
		repository.save(user);
		
	}

	public AuthResponse login(LoginRequest request) {
		
		authenticationManager
				.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));
		String token = jwtService.generateToken(request.username());
		return new AuthResponse(token, request.username(), "ROLE_USER");
		
	}

}

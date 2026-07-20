package com.ecommerce.authservice.security;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.ecommerce.authservice.entity.User;
import com.ecommerce.authservice.enums.Role;
import com.ecommerce.authservice.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	@Autowired
	JwtService jwtService;

	@Autowired
	UserRepository repository;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
			Authentication authentication) throws IOException {

		OAuth2User oauthUser = (OAuth2User) authentication.getPrincipal();

		String email = oauthUser.getAttribute("email");

		String name = oauthUser.getAttribute("name");

		User user = repository.findByEmail(email).orElseGet(() -> {
			User u = new User();
			u.setEmail(email);
			u.setFirstName(name);
			u.setUsername(email);
			u.setRole(Role.ROLE_USER);
			return repository.save(u);

		});

		String jwt = jwtService.generateToken(user.getUsername());

		String encodedJwt = URLEncoder.encode(jwt, StandardCharsets.UTF_8);

		response.sendRedirect("http://localhost:4200/login-success?token=" + encodedJwt);

	}
}

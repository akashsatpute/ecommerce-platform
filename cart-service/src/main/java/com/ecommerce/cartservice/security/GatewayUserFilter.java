package com.ecommerce.cartservice.security;

import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Trusts identity headers injected by the API gateway. Do not expose this
 * service publicly.
 */
@Component
public class GatewayUserFilter extends OncePerRequestFilter {
	private final RestTemplate http;
	@Value("${auth-service.url:http://localhost:8080}")
	private String authServiceUrl;

	public GatewayUserFilter(RestTemplate http) {
		this.http = http;
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
			throws ServletException, IOException {
		String userId = request.getHeader("X-User-Id");
		if (userId == null)
			userId = resolveUserIdFromBearer(request.getHeader("Authorization"));
		if (userId != null && userId.matches("\\d+")) {
			String role = request.getHeader("X-User-Role");
			var authorities = role == null ? List.<SimpleGrantedAuthority>of()
					: List.of(new SimpleGrantedAuthority(role));
			SecurityContextHolder.getContext()
					.setAuthentication(new UsernamePasswordAuthenticationToken(userId, null, authorities));
		}
		chain.doFilter(request, response);
	}

	@SuppressWarnings("unchecked")
	private String resolveUserIdFromBearer(String authorization) {
		if (authorization == null || !authorization.startsWith("Bearer "))
			return null;
		try {
			HttpHeaders headers = new HttpHeaders();
			headers.set(HttpHeaders.AUTHORIZATION, authorization);
			ResponseEntity<java.util.Map> response = http.exchange(authServiceUrl + "/api/auth/me", HttpMethod.GET,
					new HttpEntity<>(headers), java.util.Map.class);
			Object id = response.getBody() == null ? null : response.getBody().get("id");
			return id == null ? null : String.valueOf(id);
		} catch (RuntimeException ex) {
			return null;
		}
	}
}

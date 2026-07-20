package com.ecommerce.authservice.security;

import java.io.IOException;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.ecommerce.authservice.service.CustomUserDetailsService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.security.SignatureException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtService jwtService;
	private final CustomUserDetailsService userDetailsService;

	public JwtAuthenticationFilter(JwtService jwtService, CustomUserDetailsService userDetailsService) {

		this.jwtService = jwtService;
		this.userDetailsService = userDetailsService;
	}
	
	@Override
	protected boolean shouldNotFilter(HttpServletRequest request) {
	    return request.getServletPath().equals("/api/auth/register")
	            || request.getServletPath().equals("/api/auth/login");
	}

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		String header = request.getHeader("Authorization");

		if (header == null || !header.startsWith("Bearer ")) {
			filterChain.doFilter(request, response);
			return;
		}

		try {
			String token = header.substring(7);

			String username = jwtService.extractUsername(token);

			if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

				UserDetails user = userDetailsService.loadUserByUsername(username);

				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user, null,
						user.getAuthorities());

				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

				SecurityContextHolder.getContext().setAuthentication(authentication);
			}

			filterChain.doFilter(request, response);
		} catch (SignatureException ex) {

			sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT signature");

		} catch (ExpiredJwtException ex) {

			sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "JWT token has expired");

		} catch (JwtException ex) {

			sendError(response, HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
		}
	}

	private void sendError(HttpServletResponse response, int status, String message) throws IOException {

		response.setStatus(status);
		response.setContentType("application/json");

		ObjectMapper mapper = new ObjectMapper();

		mapper.writeValue(response.getWriter(), Map.of("status", status, "error", message));
	}
}
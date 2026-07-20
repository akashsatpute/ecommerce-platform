package com.ecommerce.cartservice.security;

import org.springframework.context.annotation.*;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.*;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
	private final GatewayUserFilter gatewayUserFilter;

	public SecurityConfig(GatewayUserFilter f) {
		gatewayUserFilter = f;
	}

	@Bean
	SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		return http.csrf(c -> c.disable()).cors(Customizer.withDefaults()).httpBasic(c -> c.disable())
				.formLogin(c -> c.disable())
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(
						a -> a.requestMatchers("/actuator/health").permitAll().anyRequest().authenticated())
				.addFilterBefore(gatewayUserFilter, UsernamePasswordAuthenticationFilter.class).build();
	}
}

package com.ecommerce.authservice.config;

import com.ecommerce.authservice.security.JwtAuthenticationFilter;
import com.ecommerce.authservice.security.OAuth2SuccessHandler;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	private final OAuth2SuccessHandler oAuth2SuccessHandler;
	private final JwtAuthenticationFilter jwtAuthenticationFilter;

	public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, OAuth2SuccessHandler oAuth2SuccessHandler) {
		this.oAuth2SuccessHandler = oAuth2SuccessHandler;
		this.jwtAuthenticationFilter = jwtAuthenticationFilter;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {

		return config.getAuthenticationManager();
	}

//    @Bean
//    SecurityFilterChain securityFilterChain(
//            HttpSecurity http)
//            throws Exception {
//
//         http
//         		.cors(cors->{})
//                .csrf(csrf -> csrf.disable())
//                .authorizeHttpRequests(auth -> auth
//                        .requestMatchers("/","/api/auth/login", "/api/auth/register")
//                        .permitAll()
//                        .anyRequest()
//                        .authenticated())
//                		.oauth2Login(oauth ->oauth
//                		.successHandler(OAuth2SuccessHandler))
//                		.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
//                  
//         return http.build();
//              
//    }
//    

	@Bean
	@Order(1)
	SecurityFilterChain apiSecurityFilterChain(HttpSecurity http) throws Exception {

		http
			.securityMatcher("/api/**")
			.cors(cors -> {})
			.csrf(csrf -> csrf.disable())
			.sessionManagement(session ->session.sessionCreationPolicy(
						SessionCreationPolicy.STATELESS))
			.authorizeHttpRequests(auth -> auth
				.requestMatchers("/api/auth/login","/api/auth/register")
				.permitAll()
				.anyRequest()
				.authenticated())

			.exceptionHandling(exception -> exception
					.authenticationEntryPoint((request, response, authException) -> {
						response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
						response.setContentType("application/json");
						response.getWriter().write("{\"message\":\"Unauthorized\"}");}))

			.addFilterBefore(jwtAuthenticationFilter,UsernamePasswordAuthenticationFilter.class);

		return http.build();

	}

	/*
	 * 
	 * GOOGLE OAUTH2 LOGIN
	 * 
	 */

	@Bean
	@Order(2)
	SecurityFilterChain oauth2SecurityFilterChain(HttpSecurity http) throws Exception {

		http
			.authorizeHttpRequests(auth -> 
				auth.requestMatchers("/","/oauth2/**","/login/**")
			.permitAll()
			.anyRequest()
			.authenticated())
			.oauth2Login(oauth ->
				oauth.successHandler(oAuth2SuccessHandler));

		return http.build();

	}

}

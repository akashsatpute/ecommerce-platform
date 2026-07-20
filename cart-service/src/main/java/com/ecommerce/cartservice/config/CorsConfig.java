package com.ecommerce.cartservice.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.*;
import org.springframework.core.Ordered;
import org.springframework.web.cors.*;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {
	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration c = new CorsConfiguration();
		c.setAllowedOriginPatterns(List.of("http://localhost:*"));
		c.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		c.setAllowedHeaders(List.of("*"));
		c.setExposedHeaders(List.of("Location"));
		c.setAllowCredentials(true);
		c.setMaxAge(3600L);
		UrlBasedCorsConfigurationSource s = new UrlBasedCorsConfigurationSource();
		s.registerCorsConfiguration("/**", c);
		return s;
	}

	/**
	 * Runs before Spring Security so browser OPTIONS requests never require
	 * authentication.
	 */
//	@Bean
//	FilterRegistrationBean<CorsFilter> corsFilter(
//	        @Qualifier("corsConfigurationSource")
//	        CorsConfigurationSource source) {
//
//	    FilterRegistrationBean<CorsFilter> bean =
//	            new FilterRegistrationBean<>(new CorsFilter(source));
//	    bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
//	    return bean;
//	}
}

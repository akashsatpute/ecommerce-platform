package com.ecommerce.cartservice.config;

import org.springframework.context.annotation.*;
import org.springframework.web.client.RestTemplate;

@Configuration
public class HttpConfig {
	@Bean
	RestTemplate restTemplate() {
		return new RestTemplate();
	}
}

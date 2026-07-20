package com.ecommerce.authservice.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


import com.ecommerce.authservice.repository.UserRepository;
import com.ecommerce.authservice.security.CustomUserDetails;


@Service
public class CustomUserDetailsService implements UserDetailsService {

	
	private final UserRepository repository;
	
	public CustomUserDetailsService (UserRepository repository) {
		this.repository = repository;
	}
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

		return repository.findByUsername(username)
				.map(CustomUserDetails::new)
				.orElseThrow(()->
				 new UsernameNotFoundException(
                         "User not found"));
	}

}

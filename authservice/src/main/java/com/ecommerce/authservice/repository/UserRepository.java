package com.ecommerce.authservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.authservice.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByUsername(String username);
	boolean existsByUsername(String userName);
	boolean existsByEmail(String email);
	Optional<User> findByEmail(String email);
}

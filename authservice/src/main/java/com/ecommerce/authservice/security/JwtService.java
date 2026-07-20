package com.ecommerce.authservice.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private static final String SECRET = "mysecretkeymysecretkeymysecretkey123456";

	private final SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes());

	public String generateToken(String username) {

		return Jwts.builder().subject(username).issuedAt(new Date())
				.expiration(new Date(System.currentTimeMillis() + 150000)).signWith(key).compact();
	}

	public String extractUsername(String token) {

		return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
	}

}

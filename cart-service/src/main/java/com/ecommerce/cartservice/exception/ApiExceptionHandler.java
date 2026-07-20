package com.ecommerce.cartservice.exception;

import java.time.Instant;
import java.util.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {
	record Error(Instant timestamp, int status, String message, String path) {
	}

	@ExceptionHandler(ResponseStatusException.class)
	ResponseEntity<Error> status(ResponseStatusException ex, HttpServletRequest req) {
		return ResponseEntity.status(ex.getStatusCode())
				.body(new Error(Instant.now(), ex.getStatusCode().value(), ex.getReason(), req.getRequestURI()));
	}

	@ExceptionHandler(Exception.class)
	ResponseEntity<Error> generic(Exception ex, HttpServletRequest req) {
		return ResponseEntity.status(500)
				.body(new Error(Instant.now(), 500, "Unexpected server error", req.getRequestURI()));
	}
}

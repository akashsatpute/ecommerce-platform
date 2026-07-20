package com.ecommerce.authservice.controller;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.ecommerce.authservice.dto.request.PaymentInitiateRequest;
import com.ecommerce.authservice.dto.request.PaymentPayRequest;
import com.ecommerce.authservice.dto.response.PaymentResponse;
import com.ecommerce.authservice.service.PaymentService;
import jakarta.validation.Valid;
@RestController @RequestMapping("/api/payment")
public class PaymentController {
  private final PaymentService payments; public PaymentController(PaymentService payments) { this.payments = payments; }
  @PostMapping("/initiate") @ResponseStatus(HttpStatus.CREATED) public PaymentResponse initiate(Authentication a, @Valid @RequestBody PaymentInitiateRequest r) { return payments.initiate(a.getName(), r); }
  @PostMapping("/pay") public PaymentResponse pay(Authentication a, @Valid @RequestBody PaymentPayRequest r) { return payments.pay(a.getName(), r); }
  @PostMapping("/success") public PaymentResponse success(Authentication a, @Valid @RequestBody PaymentPayRequest r) { return payments.success(a.getName(), r); }
  @PostMapping("/failure") public PaymentResponse failure(Authentication a, @Valid @RequestBody PaymentPayRequest r) { return payments.failure(a.getName(), r); }
  @GetMapping("/{transactionId}") public PaymentResponse get(Authentication a, @PathVariable String transactionId) { return payments.get(a.getName(), transactionId); }
}

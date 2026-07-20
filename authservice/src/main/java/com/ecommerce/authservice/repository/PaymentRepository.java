package com.ecommerce.authservice.repository;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.authservice.entity.Payment;
public interface PaymentRepository extends JpaRepository<Payment, Long> { Optional<Payment> findByTransactionIdAndUserId(String transactionId, Long userId); }

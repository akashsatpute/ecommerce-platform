package com.ecommerce.authservice.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ecommerce.authservice.dto.request.PaymentInitiateRequest;
import com.ecommerce.authservice.dto.request.PaymentPayRequest;
import com.ecommerce.authservice.dto.response.PaymentResponse;
import com.ecommerce.authservice.entity.Payment;
import com.ecommerce.authservice.entity.User;
import com.ecommerce.authservice.enums.PaymentStatus;
import com.ecommerce.authservice.repository.PaymentRepository;
import com.ecommerce.authservice.repository.UserRepository;

@Service
public class PaymentService {
    private final PaymentRepository payments;
    private final UserRepository users;
    public PaymentService(PaymentRepository payments, UserRepository users) { this.payments = payments; this.users = users; }

    @Transactional
    public PaymentResponse initiate(String username, PaymentInitiateRequest request) {
        User user = user(username);
        if (request.product().quantity() < 1 || request.product().unitPrice().signum() < 0) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid product amount");
        BigDecimal subtotal = request.product().unitPrice().multiply(BigDecimal.valueOf(request.product().quantity()));
        BigDecimal gst = subtotal.multiply(new BigDecimal("0.18")).setScale(2, RoundingMode.HALF_UP);
        Payment payment = new Payment();
        payment.setTransactionId("TXN" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssSSS")) + ThreadLocalRandom.current().nextInt(10, 100));
        payment.setOrderId("ORD-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + "-" + ThreadLocalRandom.current().nextInt(100000, 999999));
        payment.setUserId(user.getId()); payment.setAmount(subtotal.add(gst)); payment.setPaymentStatus(PaymentStatus.PENDING);
        payment.setGatewayName("SHOP_EASE_DUMMY"); payment.setGatewayResponse("Payment initiated");
        payment.setProductName(request.product().name()); payment.setProductImage(request.product().image()); payment.setDeliveryAddress(request.deliveryAddress());
        return response(payments.save(payment), user, request.product().description(), request.product().quantity(), request.product().unitPrice());
    }

    @Transactional
    public PaymentResponse pay(String username, PaymentPayRequest request) {
        User user = user(username); Payment payment = paymentFor(request.transactionId(), user.getId());
        if (payment.getPaymentStatus() == PaymentStatus.SUCCESS) return response(payment, user, null, 1, payment.getAmount());
        boolean success = "SUCCESS".equalsIgnoreCase(request.testOutcome()) || (!"FAILED".equalsIgnoreCase(request.testOutcome()) && ThreadLocalRandom.current().nextInt(10) != 0);
        payment.setPaymentMethod(request.paymentMethod()); payment.setPaymentDate(LocalDateTime.now());
        payment.setPaymentStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        payment.setGatewayResponse(success ? "Dummy gateway approved" : "Dummy gateway declined");
        // Integrate your existing OrderService and ProductStockService here. This transaction is the only success boundary.
        // orderService.createPaidOrder(...); productStockService.reduceStock(...); buyNowSessionService.clear(...);
        return response(payments.save(payment), user, null, 1, payment.getAmount());
    }

    @Transactional(readOnly = true)
    public PaymentResponse get(String username, String transactionId) { User user = user(username); Payment p = paymentFor(transactionId, user.getId()); return response(p, user, null, 1, p.getAmount()); }
    public PaymentResponse success(String username, PaymentPayRequest request) { return pay(username, new PaymentPayRequest(request.transactionId(), request.paymentMethod(), "SUCCESS")); }
    public PaymentResponse failure(String username, PaymentPayRequest request) { return pay(username, new PaymentPayRequest(request.transactionId(), request.paymentMethod(), "FAILED")); }
    private User user(String username) { return users.findByUsername(username).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not found")); }
    private Payment paymentFor(String id, Long userId) { return payments.findByTransactionIdAndUserId(id, userId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment not found")); }
    private PaymentResponse response(Payment p, User u, String description, int quantity, BigDecimal unitPrice) {
        BigDecimal subtotal = p.getAmount().divide(new BigDecimal("1.18"), 2, RoundingMode.HALF_UP); BigDecimal gst = p.getAmount().subtract(subtotal);
        return new PaymentResponse(p.getTransactionId(), p.getOrderId(), p.getAmount(), p.getPaymentMethod(), p.getPaymentStatus(), p.getPaymentDate(),
          String.join(" ", u.getFirstName() == null ? "" : u.getFirstName(), u.getLastName() == null ? "" : u.getLastName()).trim(), p.getDeliveryAddress(),
          new PaymentResponse.Product(p.getProductName(), p.getProductImage(), description, quantity, unitPrice), subtotal, BigDecimal.ZERO, BigDecimal.ZERO, gst, p.getAmount(), p.getGatewayName(), p.getPaymentStatus() == PaymentStatus.FAILED ? p.getGatewayResponse() : null);
    }
}

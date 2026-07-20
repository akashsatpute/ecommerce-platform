package com.ecommerce.authservice.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.ecommerce.authservice.enums.PaymentStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "payments")
public class Payment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, updatable = false) private String transactionId;
    @Column(nullable = false, unique = true, updatable = false) private String orderId;
    @Column(nullable = false) private Long userId;
    @Column(nullable = false, precision = 12, scale = 2) private BigDecimal amount;
    private String paymentMethod;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private PaymentStatus paymentStatus;
    private LocalDateTime paymentDate;
    @Column(nullable = false) private String gatewayName;
    @Column(length = 2000) private String gatewayResponse;
    @Column(nullable = false) private String productName;
    @Column(nullable = false) private String productImage;
    private String deliveryAddress;

    public Long getId() { return id; } public String getTransactionId() { return transactionId; } public void setTransactionId(String v) { transactionId = v; }
    public String getOrderId() { return orderId; } public void setOrderId(String v) { orderId = v; }
    public Long getUserId() { return userId; } public void setUserId(Long v) { userId = v; }
    public BigDecimal getAmount() { return amount; } public void setAmount(BigDecimal v) { amount = v; }
    public String getPaymentMethod() { return paymentMethod; } public void setPaymentMethod(String v) { paymentMethod = v; }
    public PaymentStatus getPaymentStatus() { return paymentStatus; } public void setPaymentStatus(PaymentStatus v) { paymentStatus = v; }
    public LocalDateTime getPaymentDate() { return paymentDate; } public void setPaymentDate(LocalDateTime v) { paymentDate = v; }
    public String getGatewayName() { return gatewayName; } public void setGatewayName(String v) { gatewayName = v; }
    public String getGatewayResponse() { return gatewayResponse; } public void setGatewayResponse(String v) { gatewayResponse = v; }
    public String getProductName() { return productName; } public void setProductName(String v) { productName = v; }
    public String getProductImage() { return productImage; } public void setProductImage(String v) { productImage = v; }
    public String getDeliveryAddress() { return deliveryAddress; } public void setDeliveryAddress(String v) { deliveryAddress = v; }
}

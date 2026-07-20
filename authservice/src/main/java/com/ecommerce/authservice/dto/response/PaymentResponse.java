package com.ecommerce.authservice.dto.response;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import com.ecommerce.authservice.enums.PaymentStatus;
public record PaymentResponse(String transactionId, String orderId, BigDecimal amount, String paymentMethod,
        PaymentStatus paymentStatus, LocalDateTime paymentDate, String customerName, String deliveryAddress,
        Product product, BigDecimal subtotal, BigDecimal delivery, BigDecimal discount, BigDecimal gst,
        BigDecimal totalAmount, String gatewayName, String failureReason) {
    public record Product(String name, String image, String description, Integer quantity, BigDecimal unitPrice) { }
}

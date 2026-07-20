package com.ecommerce.cartservice.repository;

import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import com.ecommerce.cartservice.domain.*;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
	Optional<CartItem> findByCartIdAndProductId(Long cartId, Long productId);
}

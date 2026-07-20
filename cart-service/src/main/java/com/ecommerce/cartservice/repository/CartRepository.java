package com.ecommerce.cartservice.repository;

import java.util.*;
import org.springframework.data.jpa.repository.*;
import com.ecommerce.cartservice.domain.*;

public interface CartRepository extends JpaRepository<Cart, Long> {
	Optional<Cart> findByUserIdAndStatus(Long userId, CartStatus status);
}

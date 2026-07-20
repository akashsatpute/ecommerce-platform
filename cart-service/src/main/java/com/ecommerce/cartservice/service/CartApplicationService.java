package com.ecommerce.cartservice.service;

import java.math.*;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.ecommerce.cartservice.domain.*;
import com.ecommerce.cartservice.dto.CartDtos.*;
import com.ecommerce.cartservice.repository.*;

@Service
@Transactional
public class CartApplicationService {
	private final CartRepository carts;
	private final CartItemRepository items;

	public CartApplicationService(CartRepository carts, CartItemRepository items) {
		this.carts = carts;
		this.items = items;
	}

	public View add(Long userId, Add r) {
		Cart c = active(userId);
		CartItem i = items.findByCartIdAndProductId(c.getId(), r.productId()).orElseGet(() -> {
			CartItem n = new CartItem();
			n.setCart(c);
			n.setProductId(r.productId());
			n.setProductName(r.productName());
			n.setProductImage(r.productImage());
			n.setPrice(r.price());
			c.getItems().add(n);
			return n;
		});
		i.setQuantity(i.getQuantity() + r.quantity());
		i.setSubtotal(i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())));
		return view(save(c));
	}

	public View update(Long userId, Long itemId, Quantity r) {
		CartItem i = owned(userId, itemId);
		i.setQuantity(r.quantity());
		i.setSubtotal(i.getPrice().multiply(BigDecimal.valueOf(r.quantity())));
		return view(save(i.getCart()));
	}

	public View remove(Long userId, Long itemId) {
		CartItem i = owned(userId, itemId);
		Cart c = i.getCart();
		c.getItems().remove(i);
		items.delete(i);
		return view(save(c));
	}

	public void clear(Long userId) {
		Cart c = active(userId);
		c.getItems().clear();
		save(c);
	}

	@Transactional(readOnly = true)
	public View get(Long userId) {
		return view(active(userId));
	}

	public View checkout(Long userId) {
		Cart c = active(userId);
		if (c.getItems().isEmpty())
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cart is empty");
		return view(c);
	}

	private Cart active(Long u) {
		return carts.findByUserIdAndStatus(u, CartStatus.ACTIVE).orElseGet(() -> {
			Cart c = new Cart();
			c.setUserId(u);
			return carts.save(c);
		});
	}

	private CartItem owned(Long u, Long id) {
		CartItem i = items.findById(id)
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cart item not found"));
		if (!i.getCart().getUserId().equals(u))
			throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cart item is not yours");
		return i;
	}

	private Cart save(Cart c) {
		c.setTotalAmount(c.getItems().stream().map(CartItem::getSubtotal).reduce(BigDecimal.ZERO, BigDecimal::add));
		c.setUpdatedDate(LocalDateTime.now());
		return carts.save(c);
	}

	private View view(Cart c) {
		return new View(c.getId(), c.getStatus().name(), c.getTotalAmount(),
				c.getItems().stream().map(i -> new Item(i.getId(), i.getProductId(), i.getProductName(),
						i.getProductImage(), i.getPrice(), i.getQuantity(), i.getSubtotal())).toList());
	}
}

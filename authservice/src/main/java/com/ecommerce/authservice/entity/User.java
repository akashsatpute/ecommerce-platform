package com.ecommerce.authservice.entity;

import java.security.Timestamp;
import java.time.LocalDateTime;

import com.ecommerce.authservice.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;



@Entity
@Table(name="users")
public class User {
	@Id
	@GeneratedValue(
		strategy = GenerationType.SEQUENCE,
		generator = "user_seq")
	@SequenceGenerator(
		name = "user_seq",
		sequenceName = "user_seq",
		allocationSize = 1)
	private long id;
	
	private String firstName;
	private String lastName;
	
	@Column(unique = true)
	private String username;
	
	@Column(unique= true)
	private String email;
	
	private String password;
	
	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role;
	
	private LocalDateTime userCreationTime;
	
	
	public User() {
		super();
		// TODO Auto-generated constructor stub
	}
	public User(long id, String firstName, String lastName, String username, String email, String password, Role role,
			LocalDateTime userCreationTime) {
		super();
		this.id = id;
		this.firstName = firstName;
		this.lastName = lastName;
		this.username = username;
		this.email = email;
		this.password = password;
		this.role = role;
		this.userCreationTime = userCreationTime;
	}
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
	public String getFirstName() {
		return firstName;
	}
	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}
	public String getLastName() {
		return lastName;
	}
	public void setLastName(String lastName) {
		this.lastName = lastName;
	}
	public LocalDateTime getUserCreationTime() {
		return userCreationTime;
	}
	public void setUserCreationTime(LocalDateTime userCreationTime) {
		this.userCreationTime = userCreationTime;
	}
	
}

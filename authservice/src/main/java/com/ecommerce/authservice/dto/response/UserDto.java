package com.ecommerce.authservice.dto.response;

public class UserDto {

    private long id;
    private String username;
    private String firsname;
    private String lastname;
    private String email;
    private String role;
	public UserDto() {
		super();
		// TODO Auto-generated constructor stub
	}
	public UserDto(long id, String username, String firsname, String lastname, String email, String role) {
		super();
		this.id = id;
		this.username = username;
		this.firsname = firsname;
		this.lastname = lastname;
		this.email = email;
		this.role = role;
	}
	public long getId() { return id; }
	public void setId(long id) { this.id = id; }
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getFirsname() {
		return firsname;
	}
	public void setFirsname(String firsname) {
		this.firsname = firsname;
	}
	public String getLastname() {
		return lastname;
	}
	public void setLastname(String lastname) {
		this.lastname = lastname;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getRole() {
		return role;
	}
	public void setRole(String role) {
		this.role = role;
	}

   
}

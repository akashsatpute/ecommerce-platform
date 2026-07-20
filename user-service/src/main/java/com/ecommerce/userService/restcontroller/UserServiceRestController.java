
package com.ecommerce.userService.restcontroller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserServiceRestController {

	@GetMapping("/")
	public String welcome() {
		return "Welcome !!";
	}

	@PostMapping("/login")
	public boolean login(@RequestBody Map<String, String> userDetails) {

		String userName = userDetails.get("Username");
		String passWord = userDetails.get("password");

		if ("Akash".equals(userName) && "Pass@123".equals(passWord)) {
			return true;
		}
		return false;
	}

}

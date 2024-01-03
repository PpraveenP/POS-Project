package com.SYNTIARO_POS_SYSTEM.Request;

import javax.validation.constraints.NotBlank;

public class StoreLoginRequest {
	@NotBlank
  private String username;

	@NotBlank
	private String password;

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}

package com.joelf.connect_desk_backend.auth.dto;

public class LoginRequest {
  private String email;
  private String password;

  // Setters and getters:
  public void setEmail(String email) {
    this.email = email;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getEmail() {
    return this.email;
  }

  public String getPassword() {
    return this.password;
  }
}

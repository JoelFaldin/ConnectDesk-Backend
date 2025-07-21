package com.joelf.connect_desk_backend.auth.dto;

public class AuthResponse {
  private String jwt;
  private String name;
  private long id;
  private String email;
  private String role;

  // Constructor:
  public AuthResponse(String jwtToken, String name, Long id, String email, String role) {
    this.jwt = jwtToken;
    this.name = name;
    this.id = id;
    this.email = email;
    this.role = role;
  }

  // Setters:
  public void setJwt(String jwt) {
    this.jwt = jwt;
  }

  public void setName(String name) {
    this.name = name;
  }

  public void setId(long id) {
    this.id = id;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setRole(String role) {
    this.role = role;
  }

  // Getters:
  public String getJwt() {
    return this.jwt;
  }

  public String getName() {
    return this.name;
  }

  public long getId() {
    return this.id;
  }

  public String getEmail() {
    return this.email;
  }

  public String getRole() {
    return this.role;
  }
}

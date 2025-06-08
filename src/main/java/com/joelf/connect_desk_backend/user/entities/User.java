package com.joelf.connect_desk_backend.user.entities;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long user_id;

  @Column(nullable = false, unique = true)
  private String rut;

  @Column(nullable = false, unique = false)
  private String names;

  @Column(nullable = true, unique = false)
  private String lastnames;

  @Column(nullable = false, unique = true)
  private String email;

  @Column(nullable = true, unique = false)
  private String password;

  @Column(nullable = false, unique = false)
  private String role;

  @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
  private UserJobDetails details;

  // Constructor:
  public User(String rut, String names, String lastnames, String email, String password, String role,
      UserJobDetails details) {
    this.rut = rut;
    this.names = names;
    this.lastnames = lastnames;
    this.email = email;
    this.password = password;
    this.role = role;
    this.details = details;
  }

  public User() {
  }

  // Setters and getters:
  public void setRut(String rut) {
    this.rut = rut;
  }

  public void setNames(String names) {
    this.names = names;
  }

  public void setLastnames(String lastnames) {
    this.lastnames = lastnames;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public void setDetails(UserJobDetails details) {
    this.details = details;
  }

  public Long getId() {
    return this.user_id;
  }

  public String getRut() {
    return this.rut;
  }

  public String getNames() {
    return this.names;
  }

  public String getLastnames() {
    return this.lastnames;
  }

  public String getEmail() {
    return this.email;
  }

  public String getPassword() {
    return this.password;
  }

  public String getRole() {
    return this.role;
  }

  public UserJobDetails getJobDetails() {
    return this.details;
  }
}

package com.joelf.connect_desk_backend.user;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
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

  @Column(nullable = false, unique = false)
  private String password;

  // Constructor:
  public User(String rut, String names, String lastnames, String email, String password) {
    this.rut = rut;
    this.names = names;
    this.lastnames = lastnames;
    this.email = email;
    this.password = password;
  }

  public User() {
  }

  // Setters and getters:
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
}

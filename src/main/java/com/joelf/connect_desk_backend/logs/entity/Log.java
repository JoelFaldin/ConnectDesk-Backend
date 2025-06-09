package com.joelf.connect_desk_backend.logs.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "log")
public class Log {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long logId;

  @Column(nullable = false, unique = false)
  private String userId;

  @Column(nullable = false, unique = false)
  private String endpoint;

  @Column(nullable = false, unique = false)
  private String method;

  @Column(nullable = false, unique = false)
  private int statusCode;

  @Column(nullable = false, unique = false)
  private String description;

  @Column(nullable = false, unique = false)
  private LocalDateTime date = LocalDateTime.now();

  // Constructor:
  public Log(String userId, String endpoint, String method, int statusCode, String description) {
    this.userId = userId;
    this.endpoint = endpoint;
    this.method = method;
    this.statusCode = statusCode;
    this.description = description;
  }

  public Log() {
  }

  // Setters and getters:
  public void setUserId(String userId) {
    this.userId = userId;
  }

  public void setEndpoint(String endpoint) {
    this.endpoint = endpoint;
  }

  public void setMethod(String method) {
    this.method = method;
  }

  public void setStatusCode(int statusCode) {
    this.statusCode = statusCode;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getUserId() {
    return this.userId;
  }

  public String getEndpoint() {
    return this.endpoint;
  }

  public String getMethod() {
    return this.method;
  }

  public int getStatusCode() {
    return this.statusCode;
  }

  public String getDescription() {
    return this.description;
  }

  public LocalDateTime getDate() {
    return this.date;
  }
}

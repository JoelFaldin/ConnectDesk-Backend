package com.joelf.connect_desk_backend.user.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_details")
public class UserJobDetails {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = false)
  private String departments;

  @Column(nullable = false, unique = false)
  private String directions;

  @Column(nullable = false, unique = false)
  private String jobNumber;

  @Column(nullable = false, unique = false)
  private String contact;

  @OneToOne
  @JoinColumn(name = "user_rut", referencedColumnName = "rut")
  private User user;

  public UserJobDetails(String departments, String directions, String jobNumber, String contact, User user) {
    this.departments = departments;
    this.directions = directions;
    this.jobNumber = jobNumber;
    this.contact = contact;
    this.user = user;
  }

  public UserJobDetails() {
  }

  // Getters and setters:
  public void setDepartments(String departments) {
    this.departments = departments;
  }

  public void setDirections(String directions) {
    this.directions = directions;
  }

  public void setJobNumber(String jobNumber) {
    this.jobNumber = jobNumber;
  }

  public void setContact(String contact) {
    this.contact = contact;
  }

  public void setUser(User user) {
    this.user = user;
  }

  public String getDepartments() {
    return this.departments;
  }

  public String getDirections() {
    return this.directions;
  }

  public String getJobNumber() {
    return this.jobNumber;
  }

  public String getContact() {
    return this.contact;
  }

  public User getUser() {
    return this.user;
  }
}

package com.joelf.connect_desk_backend.user.dto;

public class CreateUser {
  private String rut;
  private String names;
  private String lastNames;
  private String email;
  private String password;
  private String role;

  private String departments;
  private String directions;
  private String jobNumber;
  private String contact;

  // Getters and setters:
  public void setRut(String rut) {
    this.rut = rut;
  }

  public void setNames(String names) {
    this.names = names;
  }

  public void setLastNames(String lastNames) {
    this.lastNames = lastNames;
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

  public String getRut() {
    return this.rut;
  }

  public String getNames() {
    return this.names;
  }

  public String getLastnames() {
    return this.lastNames;
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
}

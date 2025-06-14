package com.joelf.connect_desk_backend.auth.dto;

public class RegisterRequest {

  // User fields:
  private String rut;
  private String names;
  private String lastnames;
  private String email;
  private String password;

  // UserJobDetails fields:
  private String departments;
  private String directions;
  private String jobNumber;
  private String contact;

  public RegisterRequest() {
  }

  public RegisterRequest(String rut, String names, String lastnames, String email, String password, String departments,
      String directions, String jobNumber, String contact) {
    this.rut = rut;
    this.names = names;
    this.lastnames = lastnames;
    this.email = email;
    this.password = password;
    this.departments = departments;
    this.directions = directions;
    this.jobNumber = jobNumber;
    this.contact = contact;
  }

  // Getters and setters:
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

  public String getLastNames() {
    return this.lastnames;
  }

  public String getEmail() {
    return this.email;
  }

  public String getPassword() {
    return this.password;
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

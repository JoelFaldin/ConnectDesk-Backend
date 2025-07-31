package com.joelf.connect_desk_backend.auth.dto;

public class ResetRequest {
  private String newPassword;
  private boolean sendEmail;

  // Setters and getters:
  public void setNewPassword(String pass) {
    this.newPassword = pass;
  }

  public void setSendEmail(boolean send) {
    this.sendEmail = send;
  }

  public String getNewPassword() {
    return this.newPassword;
  }

  public boolean getSendEmail() {
    return this.sendEmail;
  }
}

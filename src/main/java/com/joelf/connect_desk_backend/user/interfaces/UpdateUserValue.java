package com.joelf.connect_desk_backend.user.interfaces;

import jakarta.validation.constraints.NotBlank;

public class UpdateUserValue {
  @NotBlank(message = "Column field should not be empty!")
  private String column;

  @NotBlank(message = "Value field should not be empty!")
  private String value;

  public UpdateUserValue() {
  }

  public UpdateUserValue(String column, String value) {
    this.column = column;
    this.value = value;
  }

  // Getters and setters:
  public void setColumn(String column) {
    this.column = column;
  }

  public void setValue(String value) {
    this.value = value;
  }

  public String getColumn() {
    return this.column;
  }

  public String getValue() {
    return this.value;
  }
}

package com.joelf.connect_desk_backend.user.interfaces;

import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;

public class UserPatch {

  @NotEmpty(message = "Values list shoult not be empty!")
  @Valid
  private List<UpdateUserValue> values;

  public UserPatch() {
  }

  public UserPatch(List<UpdateUserValue> values) {
    this.values = values;
  }

  // Getters and setters:
  public void setValues(List<UpdateUserValue> values) {
    this.values = values;
  }

  public List<UpdateUserValue> getValues() {
    return this.values;
  }
}

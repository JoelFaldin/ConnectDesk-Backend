package com.joelf.connect_desk_backend.auth;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import com.joelf.connect_desk_backend.user.entities.User;
import com.joelf.connect_desk_backend.auth.dto.AuthResponse;
import com.joelf.connect_desk_backend.auth.dto.LoginRequest;
import com.joelf.connect_desk_backend.auth.dto.RegisterRequest;
import com.joelf.connect_desk_backend.auth.dto.ResetRequest;

@RestController
@RequestMapping("/api/auth")
class AuthController {

  @Autowired
  private AuthService authService;

  @Autowired
  private EmailService emailService;

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody RegisterRequest newUser) {
    try {
      User createdUser = authService.registerUser(
          newUser.getRut(),
          newUser.getNames(),
          newUser.getLastNames(),
          newUser.getEmail(),
          newUser.getPassword(),
          newUser.getDepartments(),
          newUser.getDirections(),
          newUser.getJobNumber(),
          newUser.getContact());

      URI location = UriComponentsBuilder
          .fromPath("/api/users/{id}")
          .buildAndExpand(createdUser.getId())
          .toUri();

      Map<String, Object> response = new HashMap<>();

      response.put("message", "User created!");
      response.put("location", location);

      return ResponseEntity.status(HttpStatus.CREATED).body(response);
    } catch (ResponseStatusException e) {
      Map<String, Object> response = new HashMap<>();

      response.put("response", e.getReason());

      return ResponseEntity.status(e.getStatusCode()).body(response);
    }
  }

  @PostMapping("")
  public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
    try {
      AuthResponse authResponse = authService.authenticateUser(loginRequest);

      Map<String, Object> response = new HashMap<>();

      response.put("message", "Login successfully! Redirecting...");
      response.put("token", authResponse.getJwt());
      response.put("names", authResponse.getName());
      response.put("email", authResponse.getEmail());
      response.put("role", authResponse.getRole());
      response.put("identifier", authResponse.getId());

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> response = new HashMap<>();

      response.put("response", e.getMessage());

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
  }

  @PostMapping("reset/{rut}")
  public ResponseEntity<?> resetPassword(@PathVariable String rut, @RequestBody ResetRequest resetRequest) {
    try {
      emailService.notifyUser(rut, "Password change", "Hey man, you changed the password of your account.", resetRequest.getNewPassword(), resetRequest.getSendEmail());

      Map<String, Object> response = new HashMap<>();

      response.put("message", "Password updated!");

      return ResponseEntity.status(HttpStatus.OK).body(response);
    } catch (ResponseStatusException e) {
      Map<String, Object> response = new HashMap<>();

      response.put("response", e.getReason());

      return ResponseEntity.status(e.getStatusCode()).body(response);
    }
  }
}

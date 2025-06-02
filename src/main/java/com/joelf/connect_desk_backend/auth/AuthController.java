package com.joelf.connect_desk_backend.auth;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import com.joelf.connect_desk_backend.user.User;
import com.joelf.connect_desk_backend.auth.dto.LoginRequest;

@RestController()
@RequestMapping("/auth")
class AuthController {
  private AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody User newUser) {
    try {
      User createdUser = authService.registerUser(
          newUser.getRut(),
          newUser.getNames(),
          newUser.getLastnames(),
          newUser.getEmail(),
          newUser.getPassword());

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
      User user = authService.authenticateUser(loginRequest.getEmail(), loginRequest.getPassword());

      Map<String, Object> response = new HashMap<>();

      response.put("message", "Login successfully! Redirecting...");
      response.put("names", user.getNames());
      response.put("lastnames", user.getLastnames());
      response.put("identifier", user.getRut());

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> response = new HashMap<>();

      response.put("response", e.getMessage());

      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }
  }
}

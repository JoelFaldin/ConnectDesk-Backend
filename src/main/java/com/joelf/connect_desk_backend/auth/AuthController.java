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
import org.springframework.web.util.UriComponentsBuilder;

import com.joelf.connect_desk_backend.user.User;

@RestController()
@RequestMapping("/auth")
class AuthController {
  private AuthService authService;

  public AuthController(AuthService authService) {
    this.authService = authService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> registerUser(@RequestBody User newUser) {
    User createdUser = authService.registerUser(
        newUser.getRut(),
        newUser.getNames(),
        newUser.getLastnames(),
        newUser.getEmail(),
        newUser.getPassword());
    System.out.println(newUser.getPassword());

    if (createdUser == null) {
      return ResponseEntity
          .status(HttpStatus.CONFLICT)
          .body("Email already in use!");
    }

    URI location = UriComponentsBuilder
        .fromPath("/api/users/{id}")
        .buildAndExpand(createdUser.getId())
        .toUri();

    return ResponseEntity.created(location).build();
  }

  @PostMapping("/login")
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
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("");
    }
  }
}

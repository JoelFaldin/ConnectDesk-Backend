package com.joelf.connect_desk_backend.auth;

import java.net.URI;

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
  public ResponseEntity<Void> registerUser(@RequestBody User newUser) {
    User createdUser = authService.registerUser(
        newUser.getRut(),
        newUser.getNames(),
        newUser.getLastnames(),
        newUser.getEmail(),
        newUser.getRawPassword());

    URI location = UriComponentsBuilder
        .fromPath("/api/users/{id}")
        .buildAndExpand(createdUser.getId())
        .toUri();

    return ResponseEntity.created(location).build();
  }
}

package com.joelf.connect_desk_backend.user;

import java.util.List;
import java.net.URI;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import com.joelf.connect_desk_backend.user.dto.CreateUser;
import com.joelf.connect_desk_backend.user.interfaces.UserPatch;
import com.joelf.connect_desk_backend.user.interfaces.UserSummaryProjection;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
class UserController {
  private UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("")
  public ResponseEntity<Map<String, Object>> getAllUsers(@RequestParam String searchValue, @RequestParam String page,
      @RequestParam String pageSize) {
    int pageInt = Integer.parseInt(page);
    int pageSizeInt = Integer.parseInt(pageSize);

    try {
      List<UserSummaryProjection> userList = userService.getAllUsers(
          searchValue,
          pageInt,
          pageSizeInt);

      long total = userService.getUserCount();

      Map<String, Object> response = new HashMap<>();

      response.put("message", "Data sent!");
      response.put("content", userList);
      response.put("showing", pageSizeInt);
      response.put("page", pageInt);
      response.put("total", total);
      response.put("totalData", userList.size());

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> response = new HashMap<>();

      response.put("response", e.getMessage());

      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
  }

  @GetMapping("/summary")
  public ResponseEntity<Long> getSummary() {
    long userCount = userService.getUserCount();

    return ResponseEntity.ok(userCount);
  }

  @PostMapping("")
  public ResponseEntity<?> createUser(@RequestBody CreateUser createUser) {
    try {
      User newUser = userService.createUser(
          createUser.getRut(),
          createUser.getNames(),
          createUser.getLastnames(),
          createUser.getEmail(),
          createUser.getPassword(),
          Objects.requireNonNullElse(createUser.getRole(), "USER"));

      URI location = UriComponentsBuilder
          .fromPath("/api/users/{id}")
          .buildAndExpand(newUser.getId())
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

  @PatchMapping("/{rut}")
  public ResponseEntity<?> updateUser(@PathVariable String rut, @RequestBody @Valid UserPatch userPatch) {
    try {
      String message = userService.updateUser(rut, userPatch);

      Map<String, Object> response = new HashMap<>();

      response.put("message", message);

      return ResponseEntity.ok(response);
    } catch (ResponseStatusException e) {
      Map<String, Object> response = new HashMap<>();

      response.put("response", e.getReason());

      return ResponseEntity.status(e.getStatusCode()).body(response);
    }
  }
}

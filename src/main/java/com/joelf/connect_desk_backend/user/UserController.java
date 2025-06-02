package com.joelf.connect_desk_backend.user;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.joelf.connect_desk_backend.user.interfaces.UserSummaryProjection;

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
}

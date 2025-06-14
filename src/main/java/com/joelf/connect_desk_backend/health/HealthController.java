package com.joelf.connect_desk_backend.health;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

  @GetMapping("")
  public ResponseEntity<?> getHealth() {
    Map<String, Object> response = new HashMap<>();

    response.put("status", "ok");
    response.put("statusCode", 200);
    response.put("timeStamp", new Date());

    return ResponseEntity.ok(response);
  }
}

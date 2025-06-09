package com.joelf.connect_desk_backend.logs;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.joelf.connect_desk_backend.logs.interfaces.FullLogPageResponse;
import com.joelf.connect_desk_backend.logs.interfaces.LogSummary;

@RestController
@RequestMapping("/api/logs")
class LogController {

  private LogService logService;

  public LogController(LogService logService) {
    this.logService = logService;
  }

  @GetMapping("/summary")
  public ResponseEntity<?> getSummary() {
    try {
      long count = logService.getSummary();

      return ResponseEntity.ok(count);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Something went wrong when fetching log summary, try again later.");
    }
  }

  @GetMapping("/all")
  public ResponseEntity<?> getAllLogs() {
    try {
      List<LogSummary> logs = logService.getAllLogs();

      return ResponseEntity.ok(logs);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Something went wrong when fetching all logs data, try again later.");
    }
  }

  @GetMapping("/{code}")
  public ResponseEntity<?> findByCode(@PathVariable("code") String code, @RequestParam("page") String page,
      @RequestParam("pageSize") String pageSize) {
    try {
      int codeInt = Integer.parseInt(code);
      int pageInt = Integer.parseInt(page);
      int pageSizeInt = Integer.parseInt(pageSize);

      FullLogPageResponse res;

      if (Integer.parseInt(code) == 1) {
        res = logService.findAll(pageInt, pageSizeInt);
      } else {
        res = logService.findByCode(codeInt, pageInt, pageSizeInt);
      }

      Map<String, Object> response = new HashMap<>();

      response.put("content", res.getLogs());
      response.put("pageSize", pageSizeInt);
      response.put("page", pageInt);
      response.put("total", res.getTotal());

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("Something went wrong when fetching logs, try again later.");
    }
  }
}

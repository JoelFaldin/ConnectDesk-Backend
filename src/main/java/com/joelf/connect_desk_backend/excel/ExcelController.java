package com.joelf.connect_desk_backend.excel;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/excel")
class ExcelController {

  private ExcelService excelService;

  public ExcelController(ExcelService excelService) {
    this.excelService = excelService;
  }

  @GetMapping("/template")
  public ResponseEntity<?> downloadTemplate() throws IOException {
    byte[] fileBytes = excelService.generateTemplate();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.setContentDispositionFormData("attachment", "template.xlsx");
    headers.setContentLength(fileBytes.length);

    return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
  }

  @GetMapping("/download/logs")
  public ResponseEntity<?> downloadLogsFile() throws IOException {
    byte[] fileBytes = excelService.generateExcelWithLogData();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.setContentDispositionFormData("attachment", "logsdata.xlsx");
    headers.setContentLength(fileBytes.length);

    return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
  }

  @GetMapping("/download")
  public ResponseEntity<?> downloadFile() throws IOException {
    byte[] fileBytes = excelService.generateExcelWithData();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.setContentDispositionFormData("attachment", "template.xlsx");
    headers.setContentLength(fileBytes.length);

    return new ResponseEntity<>(fileBytes, headers, HttpStatus.OK);
  }

  @PostMapping("/upload")
  public ResponseEntity<?> uploadFile(@RequestParam("excelFile") MultipartFile file) throws IOException {
    try {
      String response = excelService.uploadData(file);

      Map<String, Object> res = new HashMap<>();
      res.put("message", response);

      return ResponseEntity.ok(res);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
    }
  }

  @GetMapping("/summary")
  public ResponseEntity<?> getSummary() throws IOException {
    try {
      List<Integer> successCodes = Arrays.asList(200, 201);
      List<Integer> errorCodes = Arrays.asList(400, 500);

      long successCount = excelService.countOperations(successCodes);
      long errorCount = excelService.countOperations(errorCodes);

      Map<String, Object> response = new HashMap<>();

      response.put("successCount", successCount);
      response.put("errorCount", errorCount);

      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, Object> response = new HashMap<>();

      response.put("message", "There was a problem fetching excel logs, try again later.");

      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
  }
}

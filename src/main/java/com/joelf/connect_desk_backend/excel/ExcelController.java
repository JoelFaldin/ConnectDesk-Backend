package com.joelf.connect_desk_backend.excel;

import java.io.IOException;
import java.util.HashMap;
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
}

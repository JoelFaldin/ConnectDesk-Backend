package com.joelf.connect_desk_backend.excel;

import java.io.IOException;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}

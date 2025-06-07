package com.joelf.connect_desk_backend.excel;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
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

  @GetMapping("/template")
  public ResponseEntity<?> downloadTemplate() throws IOException {
    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Template");

    Font headerFont = workbook.createFont();
    headerFont.setBold(true);

    CellStyle headerStyle = workbook.createCellStyle();
    headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
    headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
    headerStyle.setFont(headerFont);

    headerStyle.setBorderTop(BorderStyle.THIN);
    headerStyle.setBorderBottom(BorderStyle.THIN);
    headerStyle.setBorderLeft(BorderStyle.THIN);
    headerStyle.setBorderRight(BorderStyle.THIN);

    sheet.setColumnWidth(0, 12 * 256);
    sheet.setColumnWidth(1, 15 * 256);
    sheet.setColumnWidth(2, 15 * 256);
    sheet.setColumnWidth(3, 10 * 256);
    sheet.setColumnWidth(5, 15 * 256);
    sheet.setColumnWidth(6, 15 * 256);
    sheet.setColumnWidth(7, 12 * 256);
    sheet.setColumnWidth(8, 12 * 256);

    Row row = sheet.createRow(0);
    String[] columns = { "Rut", "Names", "Last names", "Email", "Role", "Departments", "Directions", "Job Number",
        "Contact" };

    for (int i = 0; i < columns.length; i++) {
      Cell cell = row.createCell(i);
      cell.setCellValue(columns[i]);
      cell.setCellStyle(headerStyle);
    }

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

    workbook.write(outputStream);
    workbook.close();

    byte[] bytes = outputStream.toByteArray();

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
    headers.setContentDispositionFormData("attachment", "template.xlsx");
    headers.setContentLength(bytes.length);

    return new ResponseEntity<>(bytes, headers, HttpStatus.OK);
  }
}

package com.joelf.connect_desk_backend.excel;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.FillPatternType;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.joelf.connect_desk_backend.user.repositories.UserRepository;
import com.joelf.connect_desk_backend.user.interfaces.UserSummaryProjection;

@Service
public class ExcelService {
  private UserRepository userRepository;

  @Autowired
  public ExcelService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  public byte[] generateTemplate() throws IOException {
    return createExcelFile(null);
  }

  public byte[] generateExcelWithData() throws IOException {
    List<UserSummaryProjection> users = userRepository.findAllUsers();

    return createExcelFile(users);
  }

  private byte[] createExcelFile(List<UserSummaryProjection> users) throws IOException {
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

    Row headerRow = sheet.createRow(0);
    String[] columns = { "Rut", "Names", "Last names", "Email", "Role", "Departments", "Directions", "Job Number",
        "Contact" };

    for (int i = 0; i < columns.length; i++) {
      Cell cell = headerRow.createCell(i);
      cell.setCellValue(columns[i]);
      cell.setCellStyle(headerStyle);
    }

    if (users != null) {
      int rowIdx = 1;

      for (UserSummaryProjection user : users) {
        Row row = sheet.createRow(rowIdx);
        row.createCell(0).setCellValue(user.getRut());
        row.createCell(1).setCellValue(user.getNames());
        row.createCell(2).setCellValue(user.getLastnames());
        row.createCell(3).setCellValue(user.getEmail());
        row.createCell(4).setCellValue(user.getRole());
        row.createCell(5).setCellValue(user.getDepartments());
        row.createCell(6).setCellValue(user.getDirections());
        row.createCell(7).setCellValue(user.getJobNumber());
        row.createCell(8).setCellValue(user.getContact());
      }
    }

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

    workbook.write(outputStream);
    workbook.close();

    return outputStream.toByteArray();
  }
}

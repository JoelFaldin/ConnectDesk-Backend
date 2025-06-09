package com.joelf.connect_desk_backend.excel;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
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
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.joelf.connect_desk_backend.excel.interfaces.LogProjection;
import com.joelf.connect_desk_backend.logs.LogRepository;
import com.joelf.connect_desk_backend.user.repositories.UserRepository;
import com.joelf.connect_desk_backend.user.repositories.UserJobDetailsRepository;
import com.joelf.connect_desk_backend.user.interfaces.UserSummaryProjection;
import com.joelf.connect_desk_backend.user.entities.User;
import com.joelf.connect_desk_backend.user.entities.UserJobDetails;

@Service
public class ExcelService {
  private UserRepository userRepository;
  private LogRepository logRepository;
  private UserJobDetailsRepository userJobDetailsRepository;

  @Autowired
  public ExcelService(UserRepository userRepository, LogRepository logRepository,
      UserJobDetailsRepository userJobDetailsRepository) {
    this.userRepository = userRepository;
    this.logRepository = logRepository;
    this.userJobDetailsRepository = userJobDetailsRepository;
  }

  public byte[] generateTemplate() throws IOException {
    return createExcelFile(null);
  }

  public byte[] generateExcelWithData() throws IOException {
    List<UserSummaryProjection> users = userRepository.findAllUsers();

    return createExcelFile(users);
  }

  public byte[] generateExcelWithLogData() throws IOException {
    Workbook workbook = new XSSFWorkbook();
    Sheet sheet = workbook.createSheet("Log data");

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
    sheet.setColumnWidth(1, 20 * 256);
    sheet.setColumnWidth(2, 10 * 256);
    sheet.setColumnWidth(3, 15 * 256);
    sheet.setColumnWidth(4, 20 * 256);
    sheet.setColumnWidth(5, 15 * 256);

    Row headerRow = sheet.createRow(0);
    String[] columns = { "Log Id", "Endpoint", "Method", "Status code", "Description", "Date" };

    for (int i = 0; i < columns.length; i++) {
      Cell cell = headerRow.createCell(i);
      cell.setCellValue(columns[i]);
      cell.setCellStyle(headerStyle);
    }

    List<LogProjection> logs = logRepository.findAllLogs();

    if (logs != null) {
      int rowIdx = 1;

      for (LogProjection log : logs) {
        Row row = sheet.createRow(rowIdx);
        row.createCell(0).setCellValue(log.getLogId());
        row.createCell(1).setCellValue(log.getEndpoint());
        row.createCell(2).setCellValue(log.getMethod());
        row.createCell(3).setCellValue(log.getStatusCode());
        row.createCell(4).setCellValue(log.getDescription());
        row.createCell(5).setCellValue(log.getDate());
      }
    }

    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

    workbook.write(outputStream);
    workbook.close();

    return outputStream.toByteArray();
  }

  public String uploadData(MultipartFile file) throws IOException {
    try {
      InputStream inputStream = file.getInputStream();

      Workbook workbook = WorkbookFactory.create(inputStream);
      Sheet sheet = workbook.getSheetAt(0);

      List<User> users = new ArrayList<>();
      List<UserJobDetails> details = new ArrayList<>();

      for (int i = 1; i < sheet.getLastRowNum(); i++) {
        Row row = sheet.getRow(i);

        if (row == null)
          continue;

        User user = new User();
        UserJobDetails detail = new UserJobDetails();

        user.setRut(row.getCell(0).toString());
        user.setNames(row.getCell(1).toString());
        user.setLastnames(row.getCell(2).toString());
        user.setEmail(row.getCell(3).toString());
        user.setRole(row.getCell(4).toString());

        users.add(user);

        detail.setDepartments(row.getCell(5).toString());
        detail.setDirections(row.getCell(6).toString());
        detail.setJobNumber(row.getCell(7).toString());
        detail.setContact(row.getCell(8).toString());

        detail.setUser(user);

        details.add(detail);
      }

      userRepository.saveAll(users);
      userJobDetailsRepository.saveAll(details);

      return "Data succesfully saved in the database!";

    } catch (Exception e) {
      System.out.println(e.getMessage());
      throw new RuntimeException("Server couldn't read the file correctly.");
    }
  }

  public long countOperations(List<Integer> list) throws IOException {
    return logRepository.countOperations("excel", list);
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

package com.joelf.connect_desk_backend.logs;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Service;

import com.joelf.connect_desk_backend.logs.interfaces.FullLogPageResponse;
import com.joelf.connect_desk_backend.logs.interfaces.LogSummary;
import com.joelf.connect_desk_backend.logs.entity.Log;

@Service
public class LogService {
  private LogRepository logRepository;

  public LogService(LogRepository logRepository) {
    this.logRepository = logRepository;
  }

  public long getSummary() {
    return logRepository.count();
  }

  public List<LogSummary> getAllLogs() {
    return logRepository.getAllLogs();
  }

  public FullLogPageResponse findAll(int page, int pageSize) {
    List<Log> logs = logRepository.findAllLogs(page, pageSize);
    long total = logRepository.count();

    return new FullLogPageResponse(logs, total);
  }

  public FullLogPageResponse findByCode(int code, int page, int pageSize) {
    List<Integer> statusCodes;

    if (code == 400) {
      statusCodes = Arrays.asList(code, 404, 500);
    } else {
      statusCodes = Collections.singletonList(code);
    }

    List<Log> logList = logRepository.findByCode(statusCodes, page, pageSize);
    long total = logRepository.count();

    return new FullLogPageResponse(logList, total);
  }
}

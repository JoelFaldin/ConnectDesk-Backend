package com.joelf.connect_desk_backend.logs.interfaces;

import java.util.List;

public class LogPageResponse {
  private List<LogSummary> log;
  private long total;

  public LogPageResponse(List<LogSummary> log, long total) {
    this.log = log;
    this.total = total;
  }

  public List<LogSummary> getLogList() {
    return this.log;
  }

  public long getTotal() {
    return this.total;
  }
}

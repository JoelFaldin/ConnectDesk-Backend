package com.joelf.connect_desk_backend.logs.interfaces;

import java.util.List;

import com.joelf.connect_desk_backend.logs.entity.Log;

public class FullLogPageResponse {
  List<Log> logs;
  private long total;

  public FullLogPageResponse(List<Log> logs, long total) {
    this.logs = logs;
    this.total = total;
  }

  public List<Log> getLogs() {
    return this.logs;
  }

  public long getTotal() {
    return this.total;
  }
}

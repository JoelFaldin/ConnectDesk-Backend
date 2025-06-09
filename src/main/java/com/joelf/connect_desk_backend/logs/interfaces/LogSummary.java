package com.joelf.connect_desk_backend.logs.interfaces;

import java.time.LocalDateTime;

public interface LogSummary {
  Long getLogId();

  String getDescription();

  LocalDateTime getDate();
}

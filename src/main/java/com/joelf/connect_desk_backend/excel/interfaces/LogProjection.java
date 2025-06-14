package com.joelf.connect_desk_backend.excel.interfaces;

import java.util.Date;

public interface LogProjection {
  String getLogId();

  String getUserId();

  String getEndpoint();

  String getMethod();

  int getStatusCode();

  String getDescription();

  Date getDate();
}

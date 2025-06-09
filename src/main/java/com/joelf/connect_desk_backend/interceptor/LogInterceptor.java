package com.joelf.connect_desk_backend.interceptor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.joelf.connect_desk_backend.logs.LogRepository;
import com.joelf.connect_desk_backend.logs.entity.Log;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class LogInterceptor implements HandlerInterceptor {

  private static String START_TIME = "startTime";

  @Autowired
  private LogRepository logRepository;

  @Override
  public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
    request.setAttribute(START_TIME, System.currentTimeMillis());

    return true;
  }

  @Override
  public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex)
      throws Exception {
    String method = request.getMethod();
    String url = request.getRequestURI();
    int status = response.getStatus();

    long startTime = (long) request.getAttribute("startTime");
    long duration = System.currentTimeMillis() - startTime;

    Log log = new Log("", url, method, status, String.format("%s in %s. Done in %sms", method, url, duration));

    logRepository.save(log);
  }
}

package com.joelf.connect_desk_backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.joelf.connect_desk_backend.interceptor.LogInterceptor;

@Configuration
public class WebConfig implements WebMvcConfigurer {

  @Autowired
  private LogInterceptor logInterceptor;

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(logInterceptor)
        .addPathPatterns("/api/**")
        .excludePathPatterns("/api/users", "/api/users/summary", "/api/logs/summary", "/api/logs/all",
            "/api/logs/{code}", "/api/excel/summary", "/api/health");
  }
}

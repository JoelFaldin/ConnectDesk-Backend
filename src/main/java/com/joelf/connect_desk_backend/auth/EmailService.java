package com.joelf.connect_desk_backend.auth;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;

import com.joelf.connect_desk_backend.user.UserService;
import com.joelf.connect_desk_backend.user.entities.User;

@Service
public class EmailService {

  @Value("${spring.mail.username}")
  private String fromAddress;

  @Autowired
  private JavaMailSender mailSender;

  @Autowired
  private UserService userService;

  public void notifyUser(String rut, String subject, String text) {
    User user = userService
      .getUserByRut(rut)
      .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

    SimpleMailMessage message = new SimpleMailMessage();

    System.out.println(user.getEmail());

    message.setFrom(fromAddress);
    message.setTo(user.getEmail());
    message.setSubject(subject);
    message.setText(text);

    mailSender.send(message);
  }
}

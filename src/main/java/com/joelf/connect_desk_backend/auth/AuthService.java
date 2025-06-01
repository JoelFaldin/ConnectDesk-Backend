package com.joelf.connect_desk_backend.auth;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.joelf.connect_desk_backend.user.UserRepository;
import com.joelf.connect_desk_backend.user.User;

@Service
public class AuthService {

  private UserRepository userRepository;
  private PasswordEncoder passwordEncoder;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User registerUser(String rut, String names, String lastnames, String email, String rawPassword) {
    boolean userExists = userRepository.existsByEmail(email);

    if (userExists) {
      return null;
    }

    String hashedPassword = passwordEncoder.encode(rawPassword);
    User user = new User(rut, names, lastnames, email, hashedPassword);

    return userRepository.save(user);
  }

  public User authenticateUser(String email, String rawPassword) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials!"));

    if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
      throw new BadCredentialsException("Invalid credentials, try again.");
    }

    return user;
  }
}

package com.joelf.connect_desk_backend.auth;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.joelf.connect_desk_backend.user.repositories.UserRepository;
import com.joelf.connect_desk_backend.user.entities.User;
import com.joelf.connect_desk_backend.user.entities.UserJobDetails;

@Service
public class AuthService {

  private UserRepository userRepository;
  private PasswordEncoder passwordEncoder;

  public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User registerUser(String rut, String names, String lastnames, String email, String rawPassword,
      String departments, String directions, String jobNumber, String contact) {
    boolean userExists = userRepository.existsByEmail(email);

    if (userExists) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "User with that email already exists! Try another one.");
    }

    String hashedPassword = passwordEncoder.encode(rawPassword);

    User user = new User();
    user.setRut(rut);
    user.setNames(names);
    user.setLastnames(lastnames);
    user.setEmail(email);
    user.setPassword(hashedPassword);
    user.setRole("USER");

    UserJobDetails details = new UserJobDetails();
    details.setDepartments(departments);
    details.setDirections(directions);
    details.setJobNumber(jobNumber);
    details.setContact(contact);

    user.setDetails(details);
    details.setUser(user);

    return userRepository.save(user);
  }

  public User authenticateUser(String email, String rawPassword) {
    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("User not found, try another email..."));

    if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
      throw new BadCredentialsException("Invalid credentials, try again.");
    }

    return user;
  }
}

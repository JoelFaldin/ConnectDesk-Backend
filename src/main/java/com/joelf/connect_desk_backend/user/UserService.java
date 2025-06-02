package com.joelf.connect_desk_backend.user;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.joelf.connect_desk_backend.user.interfaces.UserSummaryProjection;

@Service
public class UserService {
  private UserRepository userRepository;
  private PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public List<UserSummaryProjection> getAllUsers(String searchValue, int page, int pageSize) {
    int offset = page * pageSize;

    if (searchValue != "") {
      List<UserSummaryProjection> searchUsers = userRepository.findUsersBySearchValue(searchValue, pageSize, offset);

      return searchUsers;
    } else {
      List<UserSummaryProjection> searchUsers = userRepository.findUsers(pageSize, offset);

      return searchUsers;
    }
  }

  public long getUserCount() {
    return userRepository.count();
  }

  public User createUser(String rut, String names, String lastnames, String email, String password, String role) {
    boolean userExists = userRepository.existsByEmail(email);

    if (userExists) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "User with that email already exists! Try another one.");
    }

    String hashedPassword = passwordEncoder.encode(password);
    User newUser = new User(rut, names, lastnames, email, hashedPassword, role);

    return userRepository.save(newUser);
  }
}

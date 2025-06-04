package com.joelf.connect_desk_backend.user;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.joelf.connect_desk_backend.user.entities.User;
import com.joelf.connect_desk_backend.user.entities.UserJobDetails;
import com.joelf.connect_desk_backend.user.interfaces.UpdateUserValue;
import com.joelf.connect_desk_backend.user.interfaces.UserPatch;
import com.joelf.connect_desk_backend.user.interfaces.UserSummaryProjection;
import com.joelf.connect_desk_backend.user.repositories.UserRepository;

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

  public User createUser(String rut, String names, String lastnames, String email, String password, String role,
      String departments, String directions, String jobNumber, String contact) {
    boolean userExists = userRepository.existsByEmail(email);

    if (userExists) {
      throw new ResponseStatusException(HttpStatus.CONFLICT, "User with that email already exists! Try another one.");
    }

    String hashedPassword = passwordEncoder.encode(password);
    User user = new User();
    user.setRut(rut);
    user.setNames(names);
    user.setLastnames(lastnames);
    user.setEmail(email);
    user.setPassword(hashedPassword);

    UserJobDetails details = new UserJobDetails();
    details.setDepartments(departments);
    details.setDirections(directions);
    details.setJobNumber(jobNumber);
    details.setContact(contact);

    user.setDetails(details);
    details.setUser(user);

    return userRepository.save(user);
  }

  public String updateUser(String originalRut, UserPatch userPatch) {
    boolean userExists = userRepository.existsByRut(originalRut);

    if (!userExists) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found, try with a different one.");
    }

    for (UpdateUserValue element : userPatch.getValues()) {
      if (element.getColumn() == null || element.getValue() == null) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing column or value in update request.");
      }

      switch (element.getColumn()) {
        case "rut" -> userRepository.updateUserRut(originalRut, element.getValue());
        case "names" -> userRepository.updateUserNames(originalRut, element.getValue());
        case "lastnames" -> userRepository.updateUserLastNames(originalRut, element.getValue());
        case "email" -> userRepository.updateUserEmail(originalRut, element.getValue());
      }
    }

    return "User updated!";
  }

  public String deleteUser(String rut) {
    boolean userExists = userRepository.existsByRut(rut);

    if (!userExists) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
    }

    userRepository.deleteByRut(rut);

    return "User removed!";
  }
}

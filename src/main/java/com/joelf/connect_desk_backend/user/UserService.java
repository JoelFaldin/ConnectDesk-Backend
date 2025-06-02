package com.joelf.connect_desk_backend.user;

import java.util.List;

import org.springframework.stereotype.Service;

import com.joelf.connect_desk_backend.user.interfaces.UserSummaryProjection;

@Service
public class UserService {
  private UserRepository userRepository;

  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
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
}

package com.joelf.connect_desk_backend.user;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.joelf.connect_desk_backend.user.interfaces.UserSummaryProjection;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  boolean existsByEmail(String email);

  Optional<User> findByEmail(String email);

  @Query(value = """
        SELECT u.rut AS rut, u.names AS names, u.lastnames AS lastnames, u.email AS email
        FROM users u
        WHERE (
          LOWER(u.rut) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(u.names) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(u.lastnames) LIKE LOWER(CONCAT('%', :search, '%')) OR
          LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        LIMIT :limit OFFSET :offset
      """, nativeQuery = true)
  List<UserSummaryProjection> findUsersBySearchValue(@Param("search") String search, @Param("limit") int limit,
      @Param("offset") int offset);

  @Query(value = "SELECT u.rut AS rut, u.names AS names, u.lastnames AS lastnames, u.email AS email FROM users u LIMIT :limit OFFSET :offset", nativeQuery = true)
  List<UserSummaryProjection> findUsers(@Param("limit") int limit, @Param("offset") int offset);
}

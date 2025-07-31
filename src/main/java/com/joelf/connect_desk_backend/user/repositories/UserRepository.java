package com.joelf.connect_desk_backend.user.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.joelf.connect_desk_backend.user.entities.User;
import com.joelf.connect_desk_backend.user.interfaces.UserSummaryProjection;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  boolean existsByEmail(String email);

  boolean existsByRut(String rut);

  Optional<User> findByEmail(String email);

  Optional<User> findByRut(String rut);

  @Query(value = """
        SELECT u.rut AS rut, u.names AS names, u.lastnames AS lastnames, u.email AS email, u.role AS role, p.departments AS departments, p.directions AS directions, p.job_number AS jobNumber, p.contact AS contact
        FROM users u
        LEFT JOIN user_details p ON p.user_rut = u.rut
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

  @Query(value = """
        SELECT u.rut AS rut, u.names AS names, u.lastnames AS lastnames, u.email AS email, u.role as role, p.departments AS departments, p.directions AS directions, p.job_number AS jobNumber, p.contact AS contact
        FROM users u
        LEFT JOIN user_details p ON p.user_rut = u.rut
        LIMIT :limit OFFSET :offset
      """, nativeQuery = true)
  List<UserSummaryProjection> findUsers(@Param("limit") int limit, @Param("offset") int offset);

  @Query(value = """
        SELECT u.rut AS rut, u.names AS names, u.lastnames AS lastnames, u.email AS email, u.role as role, p.departments AS departments, p.directions AS directions, p.job_number AS jobNumber, p.contact AS contact
        FROM users u
        LEFT JOIN user_details p ON p.user_rut = u.rut
      """, nativeQuery = true)
  List<UserSummaryProjection> findAllUsers();

  @Modifying
  @Transactional
  @Query("UPDATE User u SET u.rut = :value WHERE u.rut = :rut")
  void updateUserRut(@Param("rut") String rut, @Param("value") String value);

  @Modifying
  @Transactional
  @Query("UPDATE User u SET u.names = :names WHERE u.rut = :rut")
  void updateUserNames(@Param("rut") String rut, @Param("names") String names);

  @Modifying
  @Transactional
  @Query("UPDATE User u SET u.lastnames = :lastnames WHERE u.rut = :rut")
  void updateUserLastNames(@Param("rut") String rut, @Param("lastnames") String lastnames);

  @Modifying
  @Transactional
  @Query("UPDATE User u SET u.email = :email WHERE u.rut = :rut")
  void updateUserEmail(@Param("rut") String rut, @Param("email") String email);

  @Transactional
  void deleteByRut(String rut);
}

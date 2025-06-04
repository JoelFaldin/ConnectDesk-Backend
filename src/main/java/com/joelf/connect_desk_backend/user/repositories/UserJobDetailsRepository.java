package com.joelf.connect_desk_backend.user.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.joelf.connect_desk_backend.user.entities.UserJobDetails;

@Repository
public interface UserJobDetailsRepository extends JpaRepository<UserJobDetails, Long> {
}

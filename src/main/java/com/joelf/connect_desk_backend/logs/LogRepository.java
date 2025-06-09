package com.joelf.connect_desk_backend.logs;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.joelf.connect_desk_backend.logs.entity.Log;
import com.joelf.connect_desk_backend.logs.interfaces.LogSummary;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {

  @Query(value = """
      SELECT log_id, description, date FROM log
      """, nativeQuery = true)
  List<LogSummary> getAllLogs();

  @Query(value = """
        SELECT * FROM log
        LIMIT :pageSize OFFSET :page
      """, nativeQuery = true)
  List<Log> findAllLogs(int page, int pageSize);

  @Query(value = """
        SELECT * FROM log l
        WHERE l.status_code IN :statusCodes
        LIMIT :pageSize OFFSET :page
      """, nativeQuery = true)
  List<Log> findByCode(@Param("statusCodes") List<Integer> statusCodes, int page, int pageSize);
}

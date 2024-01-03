package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.NotificationMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface NotificationMessageRepository extends JpaRepository<NotificationMessage, Long> {

    List<NotificationMessage> findByDatetimeGreaterThanEqualAndDatetimeLessThan(LocalDateTime start, LocalDateTime end);

    List<NotificationMessage> findByDatetimeAfter(LocalDateTime datetime);

}

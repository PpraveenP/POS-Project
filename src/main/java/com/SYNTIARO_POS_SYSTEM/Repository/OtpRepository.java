package com.SYNTIARO_POS_SYSTEM.Repository;


import com.SYNTIARO_POS_SYSTEM.Entity.OtpEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OtpRepository extends JpaRepository<OtpEntity, Long> {
    Optional<OtpEntity> findByEmail(@Param("email") String email);

    @Query("SELECT o FROM OtpEntity o WHERE o.email = :email ORDER BY o.expirationTime DESC ")
    Optional<OtpEntity> findLatestByEmailAddress(@Param("email") String email);

    @Query("SELECT o FROM OtpEntity o WHERE o.email = :email ORDER BY o.expirationTime DESC")
    List<OtpEntity> findLatestByEmail(@Param("email") String email, Pageable pageable);
}

package com.SYNTIARO_POS_SYSTEM.Repository;


import com.SYNTIARO_POS_SYSTEM.Entity.SuperAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuperAdminRepository extends JpaRepository<SuperAdmin, Long> {
    static Optional<SuperAdmin> findByUsernameAndPassword(String username, String password) {
        return null;
    }

    Optional<SuperAdmin> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  Optional<SuperAdmin> findByEmail(String email);


}

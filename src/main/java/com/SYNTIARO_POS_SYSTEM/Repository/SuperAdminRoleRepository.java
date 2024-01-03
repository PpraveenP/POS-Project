package com.SYNTIARO_POS_SYSTEM.Repository;


import com.SYNTIARO_POS_SYSTEM.Entity.ERole;
import com.SYNTIARO_POS_SYSTEM.Entity.SuperAdminRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuperAdminRoleRepository extends JpaRepository<SuperAdminRole, Long> {
  Optional<SuperAdminRole> findByName(ERole name);
}

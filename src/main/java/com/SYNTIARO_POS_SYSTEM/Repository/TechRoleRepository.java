package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.ERole;
import com.SYNTIARO_POS_SYSTEM.Entity.TechRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TechRoleRepository extends JpaRepository<TechRole, Long> {
    Optional<TechRole> findByName(ERole name);
}

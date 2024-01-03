package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StateRepository extends JpaRepository<State, Long> {
}


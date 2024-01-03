package com.SYNTIARO_POS_SYSTEM.Repository;


import com.SYNTIARO_POS_SYSTEM.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {


  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  Boolean existsByContact(Long contact);

  Optional<User> findByEmail(String email);
  List<User> findByStoreid(Integer storeid);


  //-------this code added by Rushikesh for id genrate by store_id-------------------
  @Query("SELECT MAX(b.id) FROM User b WHERE b.storeid = :store_id")
  Long findLastNumberForStore(@Param("store_id") Integer store_id);


}

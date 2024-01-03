package com.SYNTIARO_POS_SYSTEM.Repository;


import com.SYNTIARO_POS_SYSTEM.Entity.ERole;
import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    static Optional<Store> findByUsernameAndPassword(String username, String password) {
        return null;
    }

    Optional<Store> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  Boolean existsByContact(String contact);

  Optional<Store> findByEmail(String email);


  @Query("SELECT DISTINCT s FROM Store s LEFT JOIN FETCH s.tax")
  List<Store> findAllStoresWithTax();

    List<Store> findByStoreRoles_Name(ERole eRole);


// THIS METHOD USE RENEWSUBSCRIPTION USING REGISTRATION NUMBER
    @Query("SELECT s FROM Store s WHERE s.regiNum = :regiNum")
    Optional<Store> findByRegistrationNumber(@Param("regiNum") String registrationNumber);

    @Query("SELECT s FROM Store s WHERE s.created_date BETWEEN :startDate AND :endDate")
    List<Store> findByCreatedDateBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

    @Query("SELECT s.email FROM Store s")
    String findStoreEmail();
}

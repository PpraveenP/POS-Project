package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface OrderRepo extends JpaRepository<Orders,Integer> {

    //THIS METHOD IS USE FOR FETCH ORDER BY STOREID
     List<Orders> findBySid(String sid);

    //-------this code added by Rushikesh for id genrate by store_id-------------------
    @Query("SELECT MAX(b.oid) FROM Orders b WHERE b.sid = :store_id")
    Integer findLastNumberForStore(@Param("store_id") String store_id);

//    @Query("SELECT MAX(b.oid) FROM Orders b WHERE b.sid = :store_id AND b.orddate= :orddate")
//    Integer findLastNumberForStore(@Param("store_id") String store_id ,  String orddate);


    @Query("SELECT MAX(b.id)  FROM Bill b WHERE b.store_id = :store_id AND b.billdate = :billdate")
    Integer findLastOrderNumberForStore(@Param("store_id") Integer store_id , LocalDate billdate);


    @Query("SELECT b FROM Orders b WHERE b.Serial_no = :Serial_no")
    Optional<Orders> findbySerialno(@Param("Serial_no") Integer Serial_no);



}

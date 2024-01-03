package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.Payment;
import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import com.SYNTIARO_POS_SYSTEM.Response.PaymentWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
@EnableJpaRepositories
public interface PaymentRepo extends JpaRepository<Payment, Integer>{

    // THIS METHOD IS USE FOR FETCH PAYMENT BY STOREID
    @Query("SELECT p FROM Payment p WHERE p.store_id = :storeId")
    List<Payment> findByStore_id(Integer storeId);

    // THIS METHOD IS USE FOR FETCH PAYMENT BY ID
    @Query("SELECT p FROM Payment p WHERE p.Serial_no = :Serial_no")
    Payment findByPaymentId(Integer Serial_no);

    //-------this code added by Rushikesh for id genrate by store_id-------------------
    @Query("SELECT MAX(b.payment_id) FROM Payment b WHERE b.store_id = :store_id")
    Integer findLastNumberForStore(@Param("store_id") Integer store_id);

    @Query("SELECT p FROM Payment p WHERE p.store_id = :store_id AND p.payment_date BETWEEN :startDate AND :endDate")
    List<Payment> findByStoreIdAndDateRange(
            @Param("store_id") Integer store_id,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );


    @Query("SELECT p FROM Payment p WHERE p.create_date BETWEEN :startDate AND :endDate")
    List<Payment> findByCreatedDateBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


    @Query("SELECT p FROM Payment p WHERE p.store_id = :store_id AND p.payment_date BETWEEN :startDate AND :endDate")
    List<Payment> findByStoreIdAndCreatedDateBetween( @Param("store_id") Integer store_id,
                                                      @Param("startDate") String startDate,
                                                      @Param("endDate") String endDate);

}

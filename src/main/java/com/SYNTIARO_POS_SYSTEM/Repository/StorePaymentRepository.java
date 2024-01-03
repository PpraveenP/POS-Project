package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.StorePayment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface StorePaymentRepository extends JpaRepository<StorePayment, Long> {

    List<StorePayment> findByStoreId(Long storeId);

    @Query("SELECT MAX(sp.paymentId) FROM StorePayment sp WHERE sp.storeId = :storeId")
    Long findMaxPaymentIdByStoreId(@Param("storeId") Long storeId);



}
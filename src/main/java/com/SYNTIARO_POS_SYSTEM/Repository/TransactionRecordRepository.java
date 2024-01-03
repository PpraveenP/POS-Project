package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.TransactionRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TransactionRecordRepository extends JpaRepository<TransactionRecord, Long> {
    @Query("SELECT t FROM TransactionRecord t WHERE t.store_id = :storeId")
    List<TransactionRecord> findByStoreid(Integer storeId);



}
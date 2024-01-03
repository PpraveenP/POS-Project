package com.SYNTIARO_POS_SYSTEM.Repository;


import com.SYNTIARO_POS_SYSTEM.Entity.Balance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


public interface BalanceRepository extends JpaRepository<Balance, Long> {

    Balance findTopByOrderByDateDesc();


    @Query("SELECT COALESCE(SUM(b.remaining_Balance), 0) FROM Balance b")
    Float getTotalClosingBalance();


    @Query("SELECT COALESCE(SUM(b.remaining_Balance), 0) FROM Balance b WHERE b.date = :day")
    Float getClosingBalanceForDay(@Param("day") LocalDate day);


    //THIS METHOD IS USE FOR ADD AMOUNT IN CLOSING BALANCE FROM BILL
    @Query("SELECT b FROM Balance b WHERE b.store_id = :store_id AND b.date = :orderDate")
    Balance findByStoreIdAndDate(@Param("store_id") Integer storeId, @Param("orderDate") LocalDate orderDate);


    //THIS METHOD IS UDE FOR FETCH BALANCE BY STOREID
    @Query("SELECT b FROM Balance b WHERE b.store_id = :storeId")
    List<Balance> findByStoreid(Integer storeId);




    //THIS METHOD IS USE FOR ADD AMOUNT IN CLOSING BALANCE FROM BILL
    @Query("SELECT b FROM Balance b WHERE b.store_id = :store_id AND b.date = :date")
    List<Balance> findByDateAndStoreId(@Param("date") LocalDate date, @Param("store_id") Integer storeId);


    //THIS METHOD IS USE FOR ADD AMOUNT IN CLOSING BALANCE FROM BILL(FOR LATEST ENTRY)
    // Custom query to find the id of the latest balance entry with the same store_id and date
    @Query(nativeQuery = true, value = "SELECT MAX(b.id) " +
            "FROM Balance b " +
            "WHERE b.store_id = :storeId " +
            " AND b.date = :calculationDate")
    Long findLatestBalanceId(@Param("storeId") Integer storeId, @Param("calculationDate") LocalDate calculationDate);

    // Custom query to update the closing balance using the retrieved id
    @Transactional
    @Modifying
    @Query(nativeQuery = true, value = "UPDATE Balance b " +
            "SET b.closing_balance = b.closing_balance + :billAmount " +
            "WHERE b.id = :balanceId")
    void updateClosingBalance(@Param("balanceId") Long balanceId, @Param("billAmount") Float billAmount);


    //THIS METHOD IS USE FOR ADD AMOUNT IN OPENING AND CLOSING BALANCE FOR NEW DAY(CHANGES MADE BY TRUPTI)
    @Query("SELECT b FROM Balance b WHERE b.store_id = :store_id AND b.date = :date")
    Balance findByDateAndStoreId(@Param("date")LocalDate date, @Param("store_id")int storeId);

    //THIS METHOD IS USE FOR ADD CASHIER,HANDEDOVERTO & AMOUNT (CLOSING BALANCE GET MINUS AFTER GIVING AMOUNT TO SOMEONE)
    @Query("SELECT b FROM Balance b WHERE b.store_id = :storeId")
    Balance findByStoreId(Integer storeId);


    //THIS METHOD IS USE FOR ADD CASHIER,HANDEDOVERTO & AMOUNT (CLOSING BALANCE GET MINUS AFTER GIVING AMOUNT TO SOMEONE)
    @Query("SELECT b FROM Balance b WHERE b.store_id = :store_id AND b.date = :date")
    List<Balance> findAllByStoreIdAndDate(@Param("store_id") Integer storeId, @Param("date") LocalDate now);



   // @Query("SELECT b.final_closing_balance FROM Balance b WHERE b.store_id = :storeId AND b.date = :yesterdayDate")
    @Query("SELECT b FROM Balance b WHERE b.store_id = :storeId AND b.date = :yesterdayDate")
    List<Balance> findYesterdayClosingBalanceByStoreId(Integer storeId, LocalDate yesterdayDate);

    @Query("SELECT b FROM Balance b WHERE b.store_id = :storeId AND b.date = :date")
    Balance findByStoreIdAndDates(@Param("storeId") Integer storeId, @Param("date") LocalDate date);

    @Query("SELECT b FROM Balance b WHERE b.store_id = :storeId AND b.date = :date")
    Balance findByStoreIdAndToday(@Param("storeId") Integer storeId, @Param("date") LocalDate date);

    @Query("SELECT b FROM Balance b WHERE b.store_id = :storeId AND b.date = CURRENT_DATE - 1 ORDER BY b.date DESC")
    Balance findTopByStoreIdForYesterday(@Param("storeId") Integer storeId);


}
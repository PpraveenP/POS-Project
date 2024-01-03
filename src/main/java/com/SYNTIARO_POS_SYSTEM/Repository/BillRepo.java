package com.SYNTIARO_POS_SYSTEM.Repository;



import com.SYNTIARO_POS_SYSTEM.Entity.Bill;
import com.SYNTIARO_POS_SYSTEM.Entity.Payment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface BillRepo extends JpaRepository<Bill,Integer> {

    Optional<Bill> findById(Integer billid);

    // THIS METHOD IS USE FOR FETCH BILL BY STOREID
    @Query("SELECT b FROM Bill b WHERE b.store_id = :storeId")
    List<Bill> findBySid(Integer storeId);

    //THIS METHOD IS USE FOR CALCULATE TOTAL CASH BY STOREID
    @Query("SELECT COALESCE(SUM(b.total), 0) FROM Bill b WHERE b.store_id = :storeId AND DATE(b.billdate) = :day AND b.paymentmode = 'cash'")
    Float calculateTotalCashAmountByStoreIdAndDay(@Param("storeId") Integer storeId, @Param("day") Date day);

    //THIS METHOD IS USE FOR CALCULATE TOTAL UPI BY STOREID
    @Query("SELECT COALESCE(SUM(b.total), 0) FROM Bill b WHERE b.store_id = :storeId AND DATE(b.billdate) = :day AND b.paymentmode = 'upi'")
    Float calculateTotalUpiAmountByStoreIdAndDay(@Param("storeId") Integer storeId, @Param("day") Date day);

    //THIS METHOD IS USE FOR CALCULATE TOTAL CARD BY STOREID
    @Query("SELECT COALESCE(SUM(b.total), 0) FROM Bill b WHERE b.store_id = :storeId AND DATE(b.billdate) = :day AND b.paymentmode = 'card'")
    Float calculateTotalCardAmountByStoreIdAndDay(@Param("storeId") Integer storeId, @Param("day") Date day);

    //THIS METHOD IS USE FOR CALCULATE OPENING BALANCE + CASH = TOTAL CLOSING BALANCE IT SHOW WHOLE LIST OF BALANCE
    @Query("SELECT b FROM Bill b WHERE b.billdate = :billdate")
    List<Bill> findByBilldate(LocalDate billdate);

    //THIS METHOD IS USE FOR CALCULATE OPENING BALANCE + CASH = TOTAL CLOSING BALANCE
    @Query("SELECT b FROM Bill b WHERE b.store_id = :store_id AND b.billdate = :billdate")
    List<Bill> findByBilldateAndStoreId(@Param("billdate") LocalDate billdate, @Param("store_id") Integer store_id);

      LocalDate date = LocalDate.now();
    @Query("SELECT MAX(b.id)  FROM Bill b WHERE b.store_id = :store_id AND b.billdate = :billdate")
    Integer findLastBillNumberForStore(@Param("store_id") Integer store_id , LocalDate billdate);

    //------------------ THIS CODE FOR GETCASH PAYMENT DATE WISE-----------  TRUPTI  ------
    @Query("SELECT COALESCE(SUM(b.total), 0) FROM Bill b WHERE b.store_id = :storeId AND b.paymentmode = 'cash' GROUP BY DATE(b.billdate)")
    List<Float> getAllCashBillsByStoreId(@Param("storeId") Integer storeId);

    //----------------- trail code -------------------------------------
    @Query("SELECT DATE(b.billdate) AS day, MAX(b.id) AS max_id " +
            "FROM Bill b " +
            "WHERE b.store_id = :store_id " +
            "GROUP BY day " +
            "ORDER BY day")
    List<Object[]> findMaxIdByDay(@Param("store_id") Integer storeId);



    @Query("SELECT b FROM Bill b WHERE b.store_id = :store_id ORDER BY b.Serial_no DESC")
    List<Bill> findLastBillByStoreId(@Param("store_id") Integer storeId, PageRequest pageable);


    @Query("SELECT b FROM Bill b WHERE b.store_id = :store_id AND b.billdate BETWEEN :start_date AND :end_date")
    List<Bill> findByStoreIdAndBillDateBetween(@Param("store_id") Integer storeId, @Param("start_date") LocalDate startDate, @Param("end_date") LocalDate endDate);


    @Query("SELECT p FROM Bill p WHERE p.store_id = :store_id AND p.billdate BETWEEN :startDate AND :endDate")
    List<Bill> findByStoreIdAndDateRange(
            @Param("store_id") Integer store_id,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );

}







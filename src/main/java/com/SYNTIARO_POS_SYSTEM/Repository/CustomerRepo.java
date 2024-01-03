package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.Balance;
import com.SYNTIARO_POS_SYSTEM.Entity.Customer_Details;
import com.SYNTIARO_POS_SYSTEM.Entity.Food;
import com.SYNTIARO_POS_SYSTEM.Entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface CustomerRepo extends JpaRepository<Customer_Details, Integer> {


    @Query("SELECT MAX(customer.customer_id) FROM Customer_Details customer WHERE customer.store_id = :storeId")
    Integer findMaxVendorIdByStoreId(@Param("storeId") Integer storeId);

    @Query("SELECT c FROM Customer_Details c WHERE c.store_id = :storeId")
    List<Customer_Details> findByStore_id(Integer storeId);

    Boolean existsBycustomername (String customername);

    Boolean existsByEmail(String email);

    Boolean existsByContact(String contact);

    @Query("SELECT v FROM Customer_Details v WHERE v.store_id = :store_id AND v.dob BETWEEN :startDate AND :endDate")
    List<Customer_Details> findByStoreIdAndDateRange(
            @Param("store_id") Integer store_id,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );


}

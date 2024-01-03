package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.Payment;
import com.SYNTIARO_POS_SYSTEM.Entity.Vendor;

import com.SYNTIARO_POS_SYSTEM.Response.VendorWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
@EnableJpaRepositories
public interface VendorRepo extends JpaRepository<Vendor, Long> {

    //THIS METHOD IS USE FOR FETCH VENDOR BY STOREID
    @Query("SELECT v FROM Vendor v WHERE v.store_id = :storeId")
    List<Vendor> findBystore_id(Integer storeId);

    @Query("SELECT CASE WHEN COUNT(v) > 0 THEN true ELSE false END " +
            "FROM Vendor v WHERE v.store_id = :store_id AND v.vendor_name = :vendor_name")
    boolean existsByStoreIdAndVendorName(@Param("store_id") Integer store_id,
                                         @Param("vendor_name") String vendor_name);


    @Query("SELECT v FROM Vendor v WHERE v.store_id = store_id")
    List<Vendor> findByStoreId(Integer store_id);


    @Query("SELECT MAX(vendor.vendor_id) FROM Vendor vendor WHERE vendor.store_id = :storeId")
    Integer findMaxVendorIdByStoreId(@Param("storeId") Integer storeId);


    @Query("SELECT v FROM Vendor v WHERE v.store_id = :store_id AND v.created_date BETWEEN :startDate AND :endDate")
    List<Vendor> findByStoreIdAndDateRange(
            @Param("store_id") Integer store_id,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );
    @Query("SELECT p FROM Vendor p WHERE p.store_id = :store_id AND p.created_date BETWEEN :startDate AND :endDate")
    List<Vendor> findByStoreIdAndCreatedDateBetween(@Param("store_id") Integer store_id,
                                                     @Param("startDate") String startDate,
                                                     @Param("endDate") String endDate);



}
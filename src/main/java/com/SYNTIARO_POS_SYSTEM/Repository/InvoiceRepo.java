package com.SYNTIARO_POS_SYSTEM.Repository;



import com.SYNTIARO_POS_SYSTEM.Entity.Invoice;

import com.SYNTIARO_POS_SYSTEM.Entity.UserSidebar;
import com.SYNTIARO_POS_SYSTEM.Response.InvoiceWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
@EnableJpaRepositories
public interface InvoiceRepo extends JpaRepository<Invoice, Integer >{


    // THIS METHOD IS USE FOR FETCH INVOICE BY STOREID
    @Query("SELECT i FROM Invoice i WHERE i.store_id = :storeId")
    List<Invoice> findByStore_id(Integer storeId);

    //-------this code added by Rushikesh for id genrate by store_id-------------------
    @Query("SELECT MAX(b.invoice_id) FROM Invoice b WHERE b.store_id = :store_id")
    Integer findLastNumberForStore(@Param("store_id") Integer store_id);


    @Query("SELECT i FROM Invoice i WHERE i.store_id = :store_id AND i.create_date BETWEEN :startDate AND :endDate")
    List<Invoice> findByStoreIdAndDateRange(
            @Param("store_id") Integer store_id,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate
    );
}
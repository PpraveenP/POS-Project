package com.SYNTIARO_POS_SYSTEM.Repository;


import com.SYNTIARO_POS_SYSTEM.Entity.Tax;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@EnableJpaRepositories
public interface TaxRepo extends JpaRepository<Tax, Long> {

    //-------this code added by Rushikesh for id genrate by store_id-------------------
    @Query("SELECT MAX(b.taxid) FROM Tax b WHERE b.storeid_fk = :store_id")
    Long findLastNumberForStore(@Param("store_id") String store_id);

}
package com.SYNTIARO_POS_SYSTEM.Repository;



import com.SYNTIARO_POS_SYSTEM.Entity.Addon;
import com.SYNTIARO_POS_SYSTEM.Response.AddonWrapper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddonRepo extends JpaRepository<Addon,Integer> {

    List<Addon> findByStoreid(String storeId);

}

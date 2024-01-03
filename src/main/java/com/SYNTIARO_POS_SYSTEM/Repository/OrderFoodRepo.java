package com.SYNTIARO_POS_SYSTEM.Repository;



import com.SYNTIARO_POS_SYSTEM.Entity.OrderFood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@EnableJpaRepositories
@Repository
public interface OrderFoodRepo extends JpaRepository<OrderFood, Integer> {

    // THIS METHOD IS USE FOR FETCH ORDERFOOD BY STOREID
    @Query("SELECT o FROM OrderFood o WHERE o.store_id = :storeId")
    List<OrderFood> findByStoreId(String storeId);

    // ----------------------RUSHIKESH ADDED THIS NEW CODE--------------------------
    @Query("SELECT o.food_name, SUM(o.quantity) AS total_quantity " +
            "FROM OrderFood o " +
            "WHERE o.store_id = :storeId " +
            "GROUP BY o.food_name " +
            "ORDER BY total_quantity DESC")
    List<Object[]> getTotalQuantityByFoodName(@Param("storeId") String storeId);

    //-------this code added by Rushikesh for id genrate by store_id-------------------
    @Query("SELECT MAX(b.food_id) FROM OrderFood b WHERE b.store_id = :store_id")
    Integer findLastNumberForStore(@Param("store_id") String store_id);

}
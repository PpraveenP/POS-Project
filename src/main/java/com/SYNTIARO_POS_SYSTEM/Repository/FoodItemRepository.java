package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Long> {
    FoodItem findByName(String foodName);
    List<FoodItem> getFoodItemsByStoreid(String storeid);
    @Query("SELECT CASE WHEN COUNT(f) > 0 THEN true ELSE false END FROM FoodItem f WHERE f.storeid = :storeid AND f.name = :name")
    boolean checkFoodNameExists(String storeid, String name);
    @Query("SELECT f FROM FoodItem f WHERE f.name = :name AND f.storeid = :storeid")
    FoodItem findByNameAndStoreId(String name, String storeid);


    //-------this code added by Rushikesh for id genrate by store_id-------------------
    @Query("SELECT MAX(b.id) FROM FoodItem b WHERE b.storeid = :store_id")
    Long findLastNumberForStore(@Param("store_id") String store_id);


}
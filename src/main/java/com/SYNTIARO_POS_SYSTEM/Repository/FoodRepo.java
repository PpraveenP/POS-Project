package com.SYNTIARO_POS_SYSTEM.Repository;



import com.SYNTIARO_POS_SYSTEM.Entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;


@EnableJpaRepositories
@Repository
public interface FoodRepo extends JpaRepository<Food, Integer> {

    // THIS METHOD IS USE FOR FETCH FOOD BY STOREID
    @Query("SELECT f FROM Food f WHERE f.store_id = :storeId")
    List<Food> findByStore_id(String storeId);

    //THIS METHOD IS USE FOR NOT INSERT SAME FOOD NAME
    @Query("SELECT COUNT(f) > 0 FROM Food f WHERE f.food_name = :food_name AND f.store_id = :store_id")
    boolean existsByFoodNameAndStoreId(@Param("food_name") String foodName, @Param("store_id") String storeId);

    //THIS METHOD IS USE FOR DO NOT INSERT SAME FOODNAME OF CATEGORY AND SUBCATEGORY
    boolean existsByCategoryAndSubcategory(String category, String subcategory);

   @Query("SELECT f FROM Food f WHERE f.store_id = :store_id")
   List<Food> findByStoreId( @Param("store_id") String store_id);
//    @Query("SELECT f FROM Food f WHERE f.store_id = :store_id AND f.created_date BETWEEN :start_date AND :end_date")
//    List<Food> findByStoreId( @Param("store_id") String store_id, @Param("start_date")
//    String startDate, @Param("end_date") String endDate);

    //-------this code added by Rushikesh for id genrate by store_id-------------------
    @Query("SELECT MAX(b.food_id) FROM Food b WHERE b.store_id = :store_id")
    Integer findLastNumberForStore(@Param("store_id") String store_id);

//    Food findByFoodName(String foodName);
}
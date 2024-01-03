package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.Button;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ButtonRepo extends JpaRepository<Button , Long> {

    @Query("SELECT f FROM Button f WHERE f.store_id = :storeId")
    List<Button> findbyStoerid(String storeId);

    @Query("SELECT b FROM Button b WHERE b.store_id = :storeId AND b.butName = :butname")
    Button findButtonByIdAndButname(@Param("storeId") String storeId, @Param("butname") String butname);


}



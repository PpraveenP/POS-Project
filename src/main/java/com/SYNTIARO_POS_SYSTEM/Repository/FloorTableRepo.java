package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.FloorTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface FloorTableRepo extends JpaRepository<FloorTable,Long> {

    @Query("SELECT MAX(b.id)  FROM FloorTable b WHERE b.storeid = :storeid" )
    Integer findLastFloorNumberForStore(@Param("storeid") String storeid );

    boolean existsBystoreidAndFloorname(long storeid, String floorname);

    //-------this code added by Rushikesh for id genrate by store_id-------------------
    @Query("SELECT MAX(b.id) FROM FloorTable b WHERE b.storeid = :storeid")
    Integer findLastNumberForStore(@Param("storeid") String storeid);

    @Query("SELECT f FROM FloorTable f WHERE f.storeid = :storeid")
   List<FloorTable> findbyStoreid(@Param("storeid") Long storeid);



}

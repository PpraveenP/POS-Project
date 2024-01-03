package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.UserSidebar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface UserSidebarRepo extends JpaRepository<UserSidebar, Integer> {

    UserSidebar findById(int parseInt);
    boolean existsByUsername(String username);

    UserSidebar findByUsername(String username);

       @Query("SELECT u FROM UserSidebar u WHERE u.store_id = :storeId")
    List<UserSidebar> getUsersByStoreId(String storeId);
}

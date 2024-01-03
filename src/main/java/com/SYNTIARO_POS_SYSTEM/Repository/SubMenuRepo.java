package com.SYNTIARO_POS_SYSTEM.Repository;

import com.SYNTIARO_POS_SYSTEM.Entity.SubMenu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubMenuRepo extends JpaRepository<SubMenu, Long> {
    SubMenu findById(int id);

}

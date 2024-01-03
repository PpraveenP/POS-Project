package com.SYNTIARO_POS_SYSTEM.Repository;





import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;


@EnableJpaRepositories
@Repository
public interface StoreRepo extends JpaRepository<Store,Integer> {
}
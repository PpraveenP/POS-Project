package com.SYNTIARO_POS_SYSTEM.security.services;


import com.SYNTIARO_POS_SYSTEM.Entity.SuperAdmin;
import com.SYNTIARO_POS_SYSTEM.Repository.SuperAdminRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class SuperAdminServiceIMPl implements SuperAdminService {

    @Autowired
    SuperAdminRepository storeRepo;


    @Override
    public List<SuperAdmin> getStore() {
        return storeRepo.findAll();
    }


}
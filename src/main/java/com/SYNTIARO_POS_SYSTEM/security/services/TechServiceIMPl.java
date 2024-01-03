package com.SYNTIARO_POS_SYSTEM.security.services;


import com.SYNTIARO_POS_SYSTEM.Entity.Tech;
import com.SYNTIARO_POS_SYSTEM.Repository.TechRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class TechServiceIMPl implements TechService {

    @Autowired
    TechRepository storeRepo;

    @Override
    public List<Tech> getStore() {
        return storeRepo.findAll();
    }

}
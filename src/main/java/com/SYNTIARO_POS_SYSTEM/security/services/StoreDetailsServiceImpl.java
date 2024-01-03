package com.SYNTIARO_POS_SYSTEM.security.services;


import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import com.SYNTIARO_POS_SYSTEM.Repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StoreDetailsServiceImpl implements UserDetailsService {
  @Autowired
  StoreRepository storeRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Store store = storeRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("Store Not Found with username: " + username));

    return StoreDetailsImpl.build(store);
  }

}

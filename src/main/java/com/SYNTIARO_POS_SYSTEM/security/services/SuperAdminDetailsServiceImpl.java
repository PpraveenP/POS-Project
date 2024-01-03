package com.SYNTIARO_POS_SYSTEM.security.services;


import com.SYNTIARO_POS_SYSTEM.Entity.SuperAdmin;
import com.SYNTIARO_POS_SYSTEM.Repository.SuperAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SuperAdminDetailsServiceImpl implements UserDetailsService {
  @Autowired
  SuperAdminRepository superAdminRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    SuperAdmin superAdmin = superAdminRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("SuperAdmin Not Found with username: " + username));

    return SuperAdminDetailsImpl.build(superAdmin);
  }

}

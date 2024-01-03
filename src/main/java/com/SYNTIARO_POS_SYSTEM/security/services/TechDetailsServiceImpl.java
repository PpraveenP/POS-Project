package com.SYNTIARO_POS_SYSTEM.security.services;


import com.SYNTIARO_POS_SYSTEM.Entity.Tech;
import com.SYNTIARO_POS_SYSTEM.Repository.TechRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TechDetailsServiceImpl implements UserDetailsService {
  @Autowired
  TechRepository techRepository;

  @Override
  @Transactional
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    Tech tech = techRepository.findByUsername(username)
        .orElseThrow(() -> new UsernameNotFoundException("Tech Not Found with username: " + username));

    return TechDetailsImpl.build(tech);
  }

}

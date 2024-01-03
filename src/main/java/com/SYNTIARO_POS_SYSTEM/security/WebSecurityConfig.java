package com.SYNTIARO_POS_SYSTEM.security;


import com.SYNTIARO_POS_SYSTEM.security.jwt.*;
import com.SYNTIARO_POS_SYSTEM.security.services.StoreDetailsServiceImpl;
import com.SYNTIARO_POS_SYSTEM.security.services.SuperAdminDetailsServiceImpl;
import com.SYNTIARO_POS_SYSTEM.security.services.TechDetailsServiceImpl;
import com.SYNTIARO_POS_SYSTEM.security.services.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableGlobalMethodSecurity(
    prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter { // extends WebSecurityConfigurerAdapter {


  ////////////////NEW CODE//////////////////////////

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  @Autowired
  private StoreDetailsServiceImpl storeDetailsService;

  @Autowired
  private AuthEntryPointJwt authEntryPointJwt;

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }

  @Autowired
  private TechDetailsServiceImpl techDetailsService;

  @Autowired
  private SuperAdminDetailsServiceImpl superAdminDetailsService;

  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  @Bean
  @Override
  public AuthenticationManager authenticationManagerBean() throws Exception {
    return super.authenticationManagerBean();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  @Override
  protected void configure(AuthenticationManagerBuilder auth) throws Exception {
    auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    auth.userDetailsService(storeDetailsService).passwordEncoder(passwordEncoder());
    auth.userDetailsService(techDetailsService).passwordEncoder(passwordEncoder());
    auth.userDetailsService(superAdminDetailsService).passwordEncoder(passwordEncoder());
  }

  @Override
  protected void configure(HttpSecurity http) throws Exception {
    http.cors().and().csrf().disable()
            .exceptionHandling().authenticationEntryPoint(authEntryPointJwt).and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests()
            .antMatchers("/api/auth/**").permitAll()
            .antMatchers("/api/test/**").permitAll()
            .antMatchers("/sys/**").permitAll()
            .anyRequest().authenticated();

    http.authenticationProvider(authenticationProvider());

    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
  }
}
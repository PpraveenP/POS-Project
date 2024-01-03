package com.SYNTIARO_POS_SYSTEM.security.services;


import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import com.fasterxml.jackson.annotation.JsonIgnore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class StoreDetailsImpl implements UserDetails {
  private static final long serialVersionUID = 1L;


  private Long id;

  private String username;

  private String email;

  @JsonIgnore
  private String password;
  private String gstno;

  private String contact;

  private  String saddress;

  private String currency;

  private String regiNum;



  private String country_code;

  private byte[] logoUrl; // Add the logo URL field

  private Collection<? extends GrantedAuthority> authorities;


  public StoreDetailsImpl(Long id, String username, String email, String password, String gstno, String currency ,String regiNum ,  String contact,String country_code ,String saddress,
                          Collection<? extends GrantedAuthority> authorities) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.gstno=gstno;
    this.currency = currency;
    this.regiNum = regiNum;
    this.contact =contact;
    this.country_code=country_code;
    this.saddress =saddress;
    this.authorities = authorities;
  }

  public static StoreDetailsImpl build(Store store) {
    List<GrantedAuthority> authorities = store.getStoreRoles().stream()
            .map(role -> new SimpleGrantedAuthority(role.getName().name()))
            .collect(Collectors.toList());

    StoreDetailsImpl userDetails = new StoreDetailsImpl(
            store.getStoreid(),
            store.getUsername(),
            store.getEmail(),
            store.getPassword(),
            store.getGstno(),
            store.getCurrency(),
            store.getRegiNum(),
            store.getContact(),
            store.getCountry_code(),
            store.getSaddress(),
            authorities);

    userDetails.setLogoUrl(store.getLogoUrl().getBytes()); // Set the logo URL
    System.out.println("Logo URL: " + store.getLogoUrl()); // Debug print statement
    return userDetails;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return authorities;
  }

  public Long getId() {
    return id;
  }

  public String getEmail() {
    return email;
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return username;
  }

  public String getGstno() {
    return gstno;
  }

  public void setGstno(String gstno) {
    this.gstno = gstno;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getContact() {
    return contact;
  }

  public void setContact(String contact) {
    this.contact = contact;
  }

  public String getSaddress() {
    return saddress;
  }

  public void setSaddress(String saddress) {
    this.saddress = saddress;
  }

  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }

  public String getRegiNum() {
    return regiNum;
  }

  public void setRegiNum(String regiNum) {
    this.regiNum = regiNum;
  }

  public byte[] getLogoUrl() {
    return logoUrl;
  }

  public String getCountry_code() {
    return country_code;
  }

  public void setCountry_code(String country_code) {
    this.country_code = country_code;
  }

  public void setLogoUrl(byte[] logoUrl) {
    this.logoUrl = logoUrl;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }


  @Override
  public boolean equals(Object o) {
    if (this == o)
      return true;
    if (o == null || getClass() != o.getClass())
      return false;
    StoreDetailsImpl Store = (StoreDetailsImpl) o;
    return Objects.equals(id, Store.id);
  }


}

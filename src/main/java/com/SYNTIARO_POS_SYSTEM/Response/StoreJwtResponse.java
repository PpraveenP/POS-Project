package com.SYNTIARO_POS_SYSTEM.Response;

import java.util.List;

public class StoreJwtResponse {
  private String token;
  private String type = "Bearer";
  private Long Storeid;
  private String username;
  private String email;

  private String gstno;

  private  String contact;

  private String regiNum;

  private String saddress;

  private String country_code;

  private String currency;

  private String storeName; // Add the store name field

  private List<String> roles;

  private byte[] logoUrl; // Add the logo URL field


  public StoreJwtResponse(String accessToken, Long Storeid, String username, String email, String gstno, String storeName, String currency ,String regiNum, String contact, String country_code , String saddress, List<String> roles, byte[] logoUrl) {
    this.token = accessToken;
    this.Storeid = Storeid;
    this.username = username;
    this.email = email;
    this.gstno=gstno;
    this.storeName = storeName;
    this.currency = currency;
    this.regiNum = regiNum;
    this.contact=contact;
    this.country_code=country_code;
    this.saddress =saddress;
    this.roles = roles;
    this.logoUrl = logoUrl;
  }

  public String getAccessToken() {
    return token;
  }

  public void setAccessToken(String accessToken) {
    this.token = accessToken;
  }

  public String getTokenType() {
    return type;
  }

  public String getGstno() {
    return gstno;
  }

  public void setGstno(String gstno) {
    this.gstno = gstno;
  }

  public String getStoreName() {return storeName;}

  public void setStoreName(String storeName) {this.storeName = storeName;}

  public void setTokenType(String tokenType) {
    this.type = tokenType;
  }

  public Long getStoreid() {
    return Storeid;
  }

  public void setStoreid(Long id) {
    this.Storeid = Storeid;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public byte[] getLogoUrl() {
    return logoUrl;
  }

  public void setLogoUrl(byte[] logoUrl) {
    this.logoUrl = logoUrl;
  }

  public List<String> getRoles() {
    return roles;
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

  public String getCountry_code() {
    return country_code;
  }

  public void setCountry_code(String country_code) {
    this.country_code = country_code;
  }


}

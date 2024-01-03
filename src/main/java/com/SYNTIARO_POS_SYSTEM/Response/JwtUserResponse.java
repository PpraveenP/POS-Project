package com.SYNTIARO_POS_SYSTEM.Response;

import java.util.List;

public class JwtUserResponse {
  private String token;
  private String type = "Bearer";
  private Long id;
  private String username;
  private String email;
  private List<String> roles;

  private Integer storeid;

  private String gstno;

  private String currency;


  // Rushikesh added this new code and make the changes below getter and setter ////
  private String registno;



  public JwtUserResponse(String accessToken, Long id, String username, String registno , String email, List<String> roles,Integer storeid,String gstno , String currency) {
    this.token = accessToken;
    this.id = id;
    this.username = username;
    this.registno=registno;
    this.email = email;
    this.roles = roles;
    this.storeid =storeid;
    this.gstno=gstno;
    this.currency=currency;
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

  public void setTokenType(String tokenType) {
    this.type = tokenType;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getGstno() {
    return gstno;
  }

  public void setGstno(String gstno) {
    this.gstno = gstno;
  }

  public Integer getStoreid() {
    return storeid;
  }

  public void setStoreid(Integer storeid) {
    this.storeid = storeid;
  }

  public String getUsername() {
    return username;
  }

  public String getRegistno() {
    return registno;
  }

  public void setRegistno(String registno) {
    this.registno = registno;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public List<String> getRoles() {
    return roles;
  }

  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }
}

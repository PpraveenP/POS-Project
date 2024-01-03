package com.SYNTIARO_POS_SYSTEM.Request;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Set;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class StoreSignupRequest {

  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;
  private String CurrentPassword;
  private String comfirmpassword;
  private String NewPassword;
  private String createdby;
  private String updatedby;
  private Long storeId;
  private boolean freeTrialRequested;
  private Integer freeTrialType;
  private String regiNum;

  private String country_code;


  private String saddress;


  @Size(max = 50)
  @Email
  @NotBlank
  private String email;


  private String store_name;

   private String contact;

  private String gstno;

  private Date date = new Date();

  private String currency;

  private String country;

  private String state;

  private byte[] logo;

  private String logourl;

  private Set<String> roles;

  private String subscriptionType;


  public Set<String> getRole() {
    return this.roles;
  }

  public void setRole(Set<String> role) {
    this.roles = role;
  }

  public void setLogo(byte[] logo) {
    this.logo = logo;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getCurrentPassword() {
    return CurrentPassword;
  }

  public void setCurrentPassword(String currentPassword) {
    CurrentPassword = currentPassword;
  }

  public String getComfirmpassword() {return comfirmpassword;}

  public void setComfirmpassword(String comfirmpassword) {
    this.comfirmpassword = comfirmpassword;
  }

  public String getNewPassword() {
    return NewPassword;
  }

  public void setNewPassword(String newPassword) {
    NewPassword = newPassword;
  }

  public String getCreatedby() {
    return createdby;
  }

  public void setCreatedby(String createdby) {
    this.createdby = createdby;
  }

  public String getUpdatedby() {
    return updatedby;
  }

  public void setUpdatedby(String updatedby) {
    this.updatedby = updatedby;
  }

  public String getSaddress() {
    return saddress;
  }

  public void setSaddress(String saddress) {
    this.saddress = saddress;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getStore_name() {
    return store_name;
  }

  public void setStore_name(String store_name) {
    this.store_name = store_name;
  }

  public String getContact() {
    return contact;
  }

  public void setContact(String contact) {
    this.contact = contact;
  }

  public String getGstno() {
    return gstno;
  }

  public void setGstno(String gstno) {
    this.gstno = gstno;
  }

  public Date getDate() {
    return date;
  }

  public void setDate(Date date) {
    this.date = date;
  }

  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }

  public String getCountry() {
    return country;
  }

  public void setCountry(String country) {
    this.country = country;
  }

  public String getState() {
    return state;
  }

  public void setState(String state) {
    this.state = state;
  }

  public Long getStoreId() {return storeId;}

  public void setStoreId(Long storeId) {this.storeId = storeId;}

  public boolean isFreeTrialRequested() {return freeTrialRequested;}

  public void setFreeTrialRequested(boolean freeTrialRequested) {this.freeTrialRequested = freeTrialRequested;}

  public int getFreeTrialType() {
    return freeTrialType;
  }

  public void setFreeTrialType(Integer freeTrialType) {
    this.freeTrialType = freeTrialType;
  }

  public String getRegiNum() {return regiNum;}

  public void setRegiNum(String regiNum) {this.regiNum = regiNum;}

  public byte[] getLogo() {
    return logo;
  }

  public String getLogourl() {
    return logourl;
  }

  public void setLogourl(String logourl) {
    this.logourl = logourl;
  }

  public Set<String> getRoles() {
    return roles;
  }

  public void setRoles(Set<String> roles) {
    this.roles = roles;
  }

  public String getCountry_code() {
    return country_code;
  }

  public String getSubscriptionType() {
    return subscriptionType;
  }

  public void setSubscriptionType(String subscriptionType) {
    this.subscriptionType = subscriptionType;
  }

  public void setCountry_code(String country_code) {
    this.country_code = country_code;
  }
}

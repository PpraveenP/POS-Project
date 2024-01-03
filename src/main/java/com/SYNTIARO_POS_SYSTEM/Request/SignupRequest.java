package com.SYNTIARO_POS_SYSTEM.Request;

import javax.persistence.Column;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Set;

public class SignupRequest {

  private Long id;

  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  private Set<String> role;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;
  private String comfirmpassword;
  private String CurrentPassword;
  private String NewPassword;

  private Integer storeid;

  @Column(name="registrationDate")
  private Date registerDate = new Date();

  private String registno;

  private String crtby;

  private String updby;

  private Date crtDate = new Date();

  private Date updateDate = new Date();

  private String gstno;

  private String address;

  private Long contact;

  private String currency;


  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<String> getRole() {
    return this.role;
  }

  public Integer getStoreid() {
    return storeid;
  }

  public void setStoreid(Integer storeid) {
    this.storeid = storeid;
  }

  public Date getRegisterDate() {
    return registerDate;
  }

  public void setRegisterDate(Date registerDate) {
    this.registerDate = registerDate;
  }

  public String getCrtby() {
    return crtby;
  }

  public void setCrtby(String crtby) {this.crtby = crtby;}

  public String getUpdby() {return updby;}

  public void setUpdby(String updby) {this.updby = updby;}

  public Date getCrtDate() {
    return crtDate;
  }

  public void setCrtDate(Date crtDate) {
    this.crtDate = crtDate;
  }

  public Date getUpdateDate() {
    return updateDate;
  }

  public void setUpdateDate(Date updateDate) {
    this.updateDate = updateDate;
  }

  public String getGstno() {
    return gstno;
  }

  public void setGstno(String gstno) {
    this.gstno = gstno;
  }

  public void setRole(Set<String> role) {
    this.role = role;
  }


  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }



  public void setContact(Long contact) {this.contact = contact;}


  public String getCurrentPassword() {return CurrentPassword;}

  public void setCurrentPassword(String currentPassword) {CurrentPassword = currentPassword;}

  public String getNewPassword() {return NewPassword;}

  public void setNewPassword(String newPassword) {NewPassword = newPassword;}

  public String getComfirmpassword() {
    return comfirmpassword;
  }

  public void setComfirmpassword(String comfirmpassword) {
    this.comfirmpassword = comfirmpassword;
  }

  public Long getContact() {
    return contact;
  }

  public String getRegistno() {
    return registno;
  }

  public void setRegistno(String registno) {
    this.registno = registno;
  }

  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }
}

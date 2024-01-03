package com.SYNTIARO_POS_SYSTEM.Entity;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users",
    uniqueConstraints = {
      @UniqueConstraint(columnNames = "username"),
      @UniqueConstraint(columnNames = "email")
    })
public class User {



  // ----------------------RUSHIKESH ADDED THIS NEW CODE----------------------
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long Serial_no ;



  private Long id;

  @NotBlank
  @Size(max = 20)
  private String username;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(max = 120)
  private String password;

  private Integer storeid;

  @Column(name="registrationDate")
  private Date registerDate = new Date();

  private String crtby;

  private String updby;

  private Date crtDate = new Date();

  private Date updateDate = new Date();

  private String gstno;

  private String address;

  private Long contact;

  private String comfirmpassword;

  private String currency;


  // Rushikesh added this new code ////
  @Column(name="registrationNumber")
  private String registno;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(  name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<UserRole> userRoles = new HashSet<>();

  // Rushikesh added this new code  registno , ID////
  public User(String username, String email, String password, String crtby, Integer storeid, Date registerDate, String registno, String gstno, String updby, Date crtDate,Date updateDate,String address,String comfirmpassword ,Long contact,Long id , String currency) {

    this.username=username;
    this.email = email;
    this.password = password;
    this.crtby = crtby;
    this.storeid = storeid;
    this.registerDate = registerDate;
    this.registno=registno;
    this.gstno = gstno;
    this.updby = updby;
    this.crtDate=crtDate;
    this.updateDate=updateDate;
    this.address = address;
    this.comfirmpassword=comfirmpassword;
    this.contact = contact;
    this.id = id;
    this.currency = currency;


  }


  public Long getSerial_no() {
    return Serial_no;
  }

  public void setSerial_no(Long serial_no) {
    Serial_no = serial_no;
  }

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

  public String getAddress() {return address;}

  public void setAddress(String address) {this.address = address;}

  public Long getContact() {return contact;}

  public void setContact(Long contact) {
    this.contact = contact;
  }

  public String getGstno() {
    return gstno;
  }

  public void setGstno(String gstno) {
    this.gstno = gstno;
  }

  public void setPassword(String password) {
    this.password = password;
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

  public void setCrtby(String crtby) {
    this.crtby = crtby;
  }

  public String getUpdby() {
    return updby;
  }

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

  public Set<UserRole> getRoles() {
    return userRoles;
  }

  public void setRoles(Set<UserRole> userRoles) {
    this.userRoles = userRoles;
  }

  public String getRegistno() {
    return registno;
  }

  public void setRegistno(String registno) {
    this.registno = registno;
  }

  public String getComfirmpassword() {
    return comfirmpassword;
  }

  public void setComfirmpassword(String comfirmpassword) {
    this.comfirmpassword = comfirmpassword;
  }

  public String getCurrency() {
    return currency;
  }

  public void setCurrency(String currency) {
    this.currency = currency;
  }

  public User() {
  }
}

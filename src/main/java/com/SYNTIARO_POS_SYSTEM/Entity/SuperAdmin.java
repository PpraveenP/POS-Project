package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;


@Data
@Entity
@Table(name = "SuperAdmin",
    uniqueConstraints = { 
      @UniqueConstraint(columnNames = "username"),
      @UniqueConstraint(columnNames = "email") 
    })
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SuperAdmin {

  @Id//STORE ID
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long superid;

  @Transient
  Random r = new Random();

  @Transient
  int no =r.nextInt(9999);


  // ALL DATABASE FILED

  @NotBlank
  @Size(max = 20)
  private String username;

  @Column(name="Store_address")
  private String saddress;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;


  @Size(max = 10, min = 10)
  @Pattern(regexp = "\\d{10}", message = "Contact number must have exactly 10 digits")
  @Column(name = "Contact")
  private String contact;

  @Column(name = "GST_NO")
  private String gstno;

  @Column(name = "Date")
  private Date date = new Date();


  @Column(name = "Country")
  private String country;

  @Column(name = "State")
  private String state;


  @NotBlank
  @Size(max = 120)
  private String password;

  private String comfirmpassword;


  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(  name = "Super_roles",
        joinColumns = @JoinColumn(name = "superid"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<SuperAdminRole> superAdminRoles = new HashSet<>();






  public SuperAdmin(String username, String saddress, String email, String contact, Date date, String country, String state, String password, String comfirmpassword) {
    this.username = username;
    this.saddress = saddress;
    this.email = email;
    this.contact = contact;
    this.date = date;
    this.country = country;
    this.state = state;
    this.password = password;
    this.comfirmpassword=comfirmpassword;
  }


  public Long getSuperid() {
    return superid;
  }

  public void setSuperid(Long superid) {
    this.superid = superid;
  }

  public Random getR() {
    return r;
  }

  public void setR(Random r) {
    this.r = r;
  }

  public int getNo() {
    return no;
  }

  public void setNo(int no) {
    this.no = no;
  }



  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
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

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Set<SuperAdminRole> getSuperAdminRoles() {
    return superAdminRoles;
  }

  public void setSuperAdminRoles(Set<SuperAdminRole> superAdminRoles) {
    this.superAdminRoles = superAdminRoles;
  }

  public String getComfirmpassword() {
    return comfirmpassword;
  }

  public void setComfirmpassword(String comfirmpassword) {
    this.comfirmpassword = comfirmpassword;
  }
}

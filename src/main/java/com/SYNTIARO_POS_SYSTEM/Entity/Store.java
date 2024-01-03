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
import java.time.LocalDateTime;
import java.util.*;


@Data
@Entity
@Table(name = "Store",
    uniqueConstraints = { 
      @UniqueConstraint(columnNames = "username"),
      @UniqueConstraint(columnNames = "email") ,
      @UniqueConstraint(columnNames = "contact")
    })
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Store {

  @Id//STORE ID
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long Storeid;
  @Column(name="registrationNumber")
  private String regiNum ;
  @NotBlank
  @Size(max = 20)
  private String username;

  @Column(name="Store_Address")
  private String saddress;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @Column(name = "Store_Name")
  private String store_name;

  @Column(name = "Contact")
  private String contact;

  @Column(name = "GST_NO")
  private String gstno;

  @Column(name = "Date")
  private Date date = new Date();

  @Column(name = "Currency")
  private String currency;

  @Column(name = "Country")
  private String country;

  @Column(name = "State")
  private String state;

  @Lob
  private byte[] logo;//LOGO FIELD


  @Column(name = "subscription_expiration")
  private LocalDateTime subscriptionExpiration;

  private String subscriptionType;


  @NotBlank
  @Size(max = 120)
  private String password;

  @Column(name = "Created_Date")
  private String created_date ;

  @Column(name = "Updated_Date")
  private String updated_date ;

  @Column(name = "Created_By")
  private String createdby;

  @Column(name = "Updated_By")
  private String updatedby;

  private String comfirmpassword;

private String country_code;

  @ManyToMany(fetch = FetchType.LAZY)
  @JoinTable(  name = "store_roles",
        joinColumns = @JoinColumn(name = "store_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"))
  private Set<StoreRole> storeRoles = new HashSet<>();
  @OneToMany(targetEntity = Tax.class,cascade = CascadeType.ALL)
  @JoinColumn(name = "Storeid_fk",referencedColumnName = "Storeid")
  private List<Tax> tax;

  @OneToMany(targetEntity = StorePayment.class,cascade = CascadeType.ALL)
  @JoinColumn(name = "Storeid_fk",referencedColumnName = "Storeid")
  private List<StorePayment> storePayments;
  @PostPersist
  public void generateStoreCode() {

    if(Storeid <= 9999) {
      SimpleDateFormat dateFormat = new SimpleDateFormat("yy/MM");
      String formattedDate = dateFormat.format(date);
      String formattedId = String.format("%04d", Storeid);
      this.regiNum = formattedDate + "/" + formattedId;


      SimpleDateFormat dateFormats = new SimpleDateFormat("yyyy/MM/dd hh:mm:ss a");
      String formattedDates = dateFormats.format(date);
      this.updated_date = formattedDates;
      this.created_date = formattedDates;
    }
    else{
      SimpleDateFormat dateFormat = new SimpleDateFormat("yy/MM");
      String formattedDate = dateFormat.format(date);
      this.regiNum = formattedDate + "/" + Storeid;


      SimpleDateFormat dateFormats = new SimpleDateFormat("yyyy/MM/dd hh:mm:ss a");
      String formattedDates = dateFormats.format(date);
      this.updated_date = formattedDates;
      this.created_date = formattedDates;

    }
  }



  public Store(String username, String saddress, String email, String contact, String gstno, Date date, String currency, String country, String state, String encode) {
  }

  public Store(String username, String saddress, String email, String storename, String showpass, String contact, String gstno, Date date, String currency, String country, String state, String password, String encode) {
  }

  public Store(String username, String saddress, String email,String store_name, String contact, String gstno, Date date, String currency, String country,String country_code, String state,  String createdby, String updatedby, String comfirmpassword ,String subscriptionType , String password) {
    this.username = username;
    this.saddress = saddress;
    this.email = email;
    this.store_name = store_name;
    this.contact = contact;
    this.gstno = gstno;
    this.date = date;
    this.currency = currency;
    this.country = country;
    this.country_code=country_code;
    this.state = state;
    this.createdby =createdby;
    this.updatedby=updatedby;
    this.comfirmpassword=comfirmpassword;
    this.subscriptionType = subscriptionType;
    this.password = password;
  }
  public Long Storeid() {return Storeid;}

  public void setAddress(String address) {}

  public LocalDateTime getSubscriptionExpiration() {
    return subscriptionExpiration;
  }


  public void setSubscriptionExpiration(LocalDateTime subscriptionExpiration) {this.subscriptionExpiration = subscriptionExpiration;}


  public String getLogoUrl() {
    return Arrays.toString(logo);
  }

  public Long getStoreid() {
    return Storeid;
  }

  public void setStoreid(Long storeid) {
    Storeid = storeid;
  }

  public String getRegiNum() {
    return regiNum;
  }

  public void setRegiNum(String regiNum) {
    this.regiNum = regiNum;
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

  public byte[] getLogo() {
    return logo;
  }

  public void setLogo(byte[] logo) {
    this.logo = logo;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getCreated_date() {
    return created_date;
  }

  public void setCreated_date(String created_date) {
    this.created_date = created_date;
  }

  public String getUpdated_date() {
    return updated_date;
  }

  public void setUpdated_date(String updated_date) {
    this.updated_date = updated_date;
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

  public Set<StoreRole> getStoreRoles() {
    return storeRoles;
  }

  public void setStoreRoles(Set<StoreRole> storeRoles) {
    this.storeRoles = storeRoles;
  }

  public List<Tax> getTax() {
    return tax;
  }

  public void setTax(List<Tax> tax) {
    this.tax = tax;
  }

  public List<StorePayment> getStorePayments() {
    return storePayments;
  }

  public void setStorePayments(List<StorePayment> storePayments) {
    this.storePayments = storePayments;
  }



  public String getSubscriptionType() {return subscriptionType;}

  public void setSubscriptionType(String subscriptionType) {this.subscriptionType = subscriptionType;}

  public boolean isFreeTrial() {return "Free Trial".equals(subscriptionType);}

  public String getComfirmpassword() {
    return comfirmpassword;
  }

  public void setComfirmpassword(String comfirmpassword) {
    this.comfirmpassword = comfirmpassword;
  }

  public String getCountry_code() {
    return country_code;
  }

  public void setCountry_code(String country_code) {
    this.country_code = country_code;
  }
}

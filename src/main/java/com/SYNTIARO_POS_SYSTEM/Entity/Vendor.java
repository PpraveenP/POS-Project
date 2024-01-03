package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import javax.validation.constraints.Digits;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;



//@NamedQuery(name ="Vendor.getAllVendor", query ="Select new com.SYNTIARO_POS_SYSTEM.Response.VendorWrapper (v.vendor_id, v.vendor_name, v.vendor_address, v.mobile_no, v.GST_no,  v.bank_name, v.Branch, v.account_no, v.IFSC_code, v.UPI_id )from Vendor v")


@Entity
@Table(name="Vendor")
@Data
@DynamicUpdate
@DynamicInsert
@AllArgsConstructor
@NoArgsConstructor
public class Vendor implements Serializable {

   @Serial
   private static final long SerialVersion =1L;

    // ----------------------RUSHIKESH ADDED THIS NEW CODE----------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Serial_no ;

   @Column(name="vendor_id", length = 45)
   private Integer vendor_id;

   @Column(name="vendor_name", length = 255)
   private String vendor_name;

   @Column(name="vendor_address", length = 255)
   private String vendor_address;

   @Column(name="mobile_no")
   private Long mobile_no;

   @Column(name="GST_no", length = 255)
   private String gst_no;

   @Column(name="update_date", length = 50)
   private String update_date ;

   @Column(name="update_by", length = 50)
   private String update_by;

   @Column(name="created_date")
   private String created_date ;

   @Column(name="created_by")
   private String created_by;

   @Column(name="Store_id", length = 255)
   private Integer store_id;

   @Column(name="bank_name", length = 255)
   private String bank_name;

   @Column(name="branch", length = 255)
   private String branch;

   @Column(name="account_no", length = 255)
   private Long account_no;

   @Column(name="ifsc_code", length = 255)
   private String ifsc_code;

   @Column(name="upi_id", length = 255)
   private String upi_id;

   @Column(name="vendor_code", length = 255)
   private String vendor_code;


    public Integer getVendor_id() {
        return vendor_id;
    }

    public void setVendor_id(Integer vendor_id) {
        this.vendor_id = vendor_id;
    }

    public String getVendor_name() {
      return vendor_name;
   }

   public void setVendor_name(String vendor_name) {
      this.vendor_name = vendor_name;
   }

   public String getVendor_address() {
      return vendor_address;
   }

   public void setVendor_address(String vendor_address) {
      this.vendor_address = vendor_address;
   }

   public Long getMobile_no() {
      return mobile_no;
   }

   public void setMobile_no(Long mobile_no) {
      this.mobile_no = mobile_no;
   }

   public String getGst_no() {
      return gst_no;
   }

   public void setGst_no(String gst_no) {
      this.gst_no = gst_no;
   }

   public String getUpdate_by() {
      return update_by;
   }

   public void setUpdate_by(String update_by) {
      this.update_by = update_by;
   }

   public String getCreated_by() {
      return created_by;
   }

   public void setCreated_by(String created_by) {
      this.created_by = created_by;
   }

    public Integer getStore_id() {
        return store_id;
    }

    public void setStore_id(Integer store_id) {
        this.store_id = store_id;
    }

    public String getBank_name() {
      return bank_name;
   }

   public void setBank_name(String bank_name) {
      this.bank_name = bank_name;
   }

   public String getBranch() {
      return branch;
   }

   public void setBranch(String branch) {
      this.branch = branch;
   }

   public Long getAccount_no() {
      return account_no;
   }

   public void setAccount_no(Long account_no) {
      this.account_no = account_no;
   }

   public String getIfsc_code() {
      return ifsc_code;
   }

   public void setIfsc_code(String ifsc_code) {
      this.ifsc_code = ifsc_code;
   }

   public String getUpi_id() {
      return upi_id;
   }

   public void setUpi_id(String upi_id) {
      this.upi_id = upi_id;
   }

   public String getVendor_code() {
      return vendor_code;
   }

   public void setVendor_code(String vendor_code) {
      this.vendor_code = vendor_code;
   }

    public String getUpdate_date() {
        return update_date;
    }

    public void setUpdate_date(String update_date) {
        this.update_date = update_date;
    }

    public String getCreated_date() {
        return created_date;
    }

    public void setCreated_date(String created_date) {
        this.created_date = created_date;
    }

    @PostPersist
    public void generateStoreCode() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDate = dateFormat.format(date);
        SimpleDateFormat dateFormats = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDates = dateFormats.format(date);
        this.update_date = formattedDate;
        this.created_date= formattedDates;
    }
}
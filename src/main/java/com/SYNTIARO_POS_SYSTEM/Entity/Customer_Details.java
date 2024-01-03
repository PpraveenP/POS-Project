package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "Customer_Details")
public class Customer_Details {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Integer Serial_no ;

    @Column(name="customer_id", length = 45)
    private Integer customer_id;

    @Column(name="customer_name")
   private String customername;

    @Column(name="email")
    private String email;

    @Column(name="date_of_birth")
    private String dob;

    @Column(name="contact")
    private String contact;

    @Column(name="store_id")
    private Integer store_id;

    @Column(name="created_date")
    private LocalDate createddate = LocalDate.now();

    public Integer getSerial_no() {
        return Serial_no;
    }

    public void setSerial_no(Integer serial_no) {
        Serial_no = serial_no;
    }

    public Integer getCustomer_id() {
        return customer_id;
    }

    public void setCustomer_id(Integer customer_id) {
        this.customer_id = customer_id;
    }

    public String getCustomername() {
        return customername;
    }

    public void setCustomername(String customername) {
        this.customername = customername;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDob() {
        return dob;
    }

    public void setDob(String dob) {
        this.dob = dob;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Integer getStore_id() {
        return store_id;
    }

    public void setStore_id(Integer store_id) {
        this.store_id = store_id;
    }

    public LocalDate getCreateddate() {
        return createddate;
    }

    public void setCreateddate(LocalDate createddate) {
        this.createddate = createddate;
    }
    @PostPersist
    public void generateStoreCode() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDate = dateFormat.format(date);
        this.dob = formattedDate;

    }


}

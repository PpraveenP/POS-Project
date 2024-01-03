package com.SYNTIARO_POS_SYSTEM.Entity;


import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.http.ResponseEntity;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;

@Data
@NoArgsConstructor
@DynamicUpdate
@DynamicInsert
@Table(name = "Balance")
@Entity
public class Balance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date = LocalDate.now();
    private Double todays_opening_Balance;
    private Integer store_id;
    private String createdby;
    private String updatedby;
    private String createddate ;
    private String updateddate ;
    private Double remaining_Balance;
    private String final_handed_over_to;
    private Double final_amount;
    private Double final_closing_balance;
    private Double addmoreamount;


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getTodays_opening_Balance() {
        return todays_opening_Balance;
    }

    public void setTodays_opening_Balance(Double todays_opening_Balance) {
        this.todays_opening_Balance = todays_opening_Balance;
    }

    public Integer getStore_id() {
        return store_id;
    }

    public void setStore_id(Integer store_id) {
        this.store_id = store_id;
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

    public String getCreateddate() {
        return createddate;
    }

    public void setCreateddate(String createddate) {
        this.createddate = createddate;
    }

    public String getUpdateddate() {
        return updateddate;
    }

    public void setUpdateddate(String updateddate) {
        this.updateddate = updateddate;
    }

    public Double getRemaining_Balance() {
        return remaining_Balance;
    }

    public void setRemaining_Balance(Double remaining_Balance) {
        this.remaining_Balance = remaining_Balance;
    }

    public String getFinal_handed_over_to() {
        return final_handed_over_to;
    }

    public void setFinal_handed_over_to(String final_handed_over_to) {
        this.final_handed_over_to = final_handed_over_to;
    }

    public Double getFinal_amount() {
        return final_amount;
    }

    public void setFinal_amount(Double final_amount) {
        this.final_amount = final_amount;
    }

    public Double getFinal_closing_balance() {
        return final_closing_balance;
    }

    public void setFinal_closing_balance(Double final_closing_balance) {
        this.final_closing_balance = final_closing_balance;
    }

    public Double getAddmoreamount() {
        return addmoreamount;
    }

    public void setAddmoreamount(Double addmoreamount) {
        this.addmoreamount = addmoreamount;
    }

    //-------------------- ADDED BY RUSHIKESH THIS CODE  ----------------------------
    @PostPersist
    public void generateStoreCode() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
        String formattedDate = dateFormat.format(date);
        this.updateddate = formattedDate;
        this.createddate = formattedDate;
    }
}
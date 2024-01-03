package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "tax")
public class Tax {


    // ----------------------RUSHIKESH ADDED THIS NEW CODE----------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Serial_no ;

    @Column(name = "Tax_Id")
    private Long taxid;

    @Column(name = "name")
    private String name;

    @Column(name = "rate")
    private Float rate;

    @Column(name = "createdby")
    private String createdby;

    @Column(name = "updatedate")
    private String updatedate ;

    @Column(name = "createddate")
    private String createddate ;

    @Column(name = "updatedby")
    private String updatedby;

    private String storeid_fk;


    public Long getTaxid() {
        return taxid;
    }

    public void setTaxid(Long taxid) {
        this.taxid = taxid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Float getRate() {
        return rate;
    }

    public void setRate(Float rate) {
        this.rate = rate;
    }

    public String getCreatedby() {
        return createdby;
    }

    public void setCreatedby(String createdby) {
        this.createdby = createdby;
    }

    public String getUpdatedate() {
        return updatedate;
    }

    public void setUpdatedate(String updatedate) {
        this.updatedate = updatedate;
    }

    public String getCreateddate() {
        return createddate;
    }

    public void setCreateddate(String createddate) {
        this.createddate = createddate;
    }

    public String getUpdatedby() {
        return updatedby;
    }

    public void setUpdatedby(String updatedby) {
        this.updatedby = updatedby;
    }

    public String getStoreid_fk() {
        return storeid_fk;
    }

    public void setStoreid_fk(String storeid_fk) {
        this.storeid_fk = storeid_fk;
    }

    @PostPersist
    public void generateStoreCode() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
        String formattedDate = dateFormat.format(date);
        this.updatedate = formattedDate;
        this.createddate = formattedDate;
    }


}

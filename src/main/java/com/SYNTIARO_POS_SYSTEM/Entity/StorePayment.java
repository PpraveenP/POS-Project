package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;

@Data
@Entity
@Table(name = "store_payment")
@AllArgsConstructor
@NoArgsConstructor
public class StorePayment {


    // ----------------------RUSHIKESH ADDED THIS NEW CODE----------------------
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Serial_no ;


    @Column(name = "payment_id")
    private Long paymentId;

    @Column(name = "store_name")
    private String store_name;

    @Column(name = "account_no")
    private String accountNo;

    @Column(name = "upi_id")
    private String upiId;

    @Column(name = "bank_name")
    private String bankName;

    @Column(name = "branch_name")
    private String branchName;

    @Column(name = "ifsc_code")
    private String ifscCode;

    @Column(name = "store_id")
    private Long storeId;

    @Column(name = "created_by")
    private String createdBy;

    @Column(name = "created_date")
    private String createdDate ;

    @Column(name = "updated_by")
    private String updatedBy;

    @Column(name = "updated_date")
    private String updatedDate ;

    private String storeid_fk;

    public Long getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public String getStore_name() {
        return store_name;
    }

    public void setStore_name(String store_name) {
        this.store_name = store_name;
    }

    public String getAccountNo() {
        return accountNo;
    }

    public void setAccountNo(String accountNo) {
        this.accountNo = accountNo;
    }

    public String getUpiId() {
        return upiId;
    }

//    public void setUpiId(String upiId) {
//        this.upiId ="upi://pay?pa="+upiId;
//    }

    public void setUpiId(String upiId) {
        this.upiId = upiId;
    }



    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBranchName() {
        return branchName;
    }

    public void setBranchName(String branchName) {
        this.branchName = branchName;
    }

    public String getIfscCode() {
        return ifscCode;
    }

    public void setIfscCode(String ifscCode) {
        this.ifscCode = ifscCode;
    }

    public Long getStoreId() {
        return storeId;
    }

    public void setStoreId(Long storeId) {
        this.storeId = storeId;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }


    public String getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
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
        this.updatedDate = formattedDate;
        this.createdDate = formattedDate;
    }

}

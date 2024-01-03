package com.SYNTIARO_POS_SYSTEM.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BalanceRequest {
    private LocalDate date;
    private Double todaysopeningBalance;
    private Integer store_id;
    private String createdby;
    private String updatedby;
    private Double previousclosingBalance;
    private Double addmoreamounts;
    private String final_handed_over_to;
    private Double final_amount;
    private Double final_closing_balance;


    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getTodaysopeningBalance() {
        return todaysopeningBalance;
    }

    public void setTodaysopeningBalance(Double todaysopeningBalance) {
        this.todaysopeningBalance = todaysopeningBalance;
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

    public Double getPreviousclosingBalance() {
        return previousclosingBalance;
    }

    public void setPreviousclosingBalance(Double previousclosingBalance) {
        this.previousclosingBalance = previousclosingBalance;
    }

    public Double getAddmoreamounts() {
        return addmoreamounts;
    }

    public void setAddmoreamounts(Double addmoreamounts) {
        this.addmoreamounts = addmoreamounts;
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
}
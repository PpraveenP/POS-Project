package com.SYNTIARO_POS_SYSTEM.Response;
import com.SYNTIARO_POS_SYSTEM.Request.PaymentSummary;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class BalanceWithPaymentSummaryResponse {

    private Long id;
    private LocalDate date;
    private Float openingBalance;
    private Float closingBalance;
    private Integer store_id;
    private String cashier;
    private String HandedOverTo;
    private List<PaymentSummary> paymentSummaries = new ArrayList<>();

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

    public Float getOpeningBalance() {
        return openingBalance;
    }

    public void setOpeningBalance(Float openingBalance) {
        this.openingBalance = openingBalance;
    }

    public Float getClosingBalance() {
        return closingBalance;
    }

    public void setClosingBalance(Float closingBalance) {
        this.closingBalance = closingBalance;
    }

    public Integer getStore_id() {
        return store_id;
    }

    public void setStore_id(Integer store_id) {
        this.store_id = store_id;
    }

    public String getCashier() {
        return cashier;
    }

    public void setCashier(String cashier) {
        this.cashier = cashier;
    }

    public String getHandedOverTo() {
        return HandedOverTo;
    }

    public void setHandedOverTo(String handedOverTo) {
        HandedOverTo = handedOverTo;
    }

    public List<PaymentSummary> getPaymentSummaries() {
        return paymentSummaries;
    }

    public void setPaymentSummaries(List<PaymentSummary> paymentSummaries) {
        this.paymentSummaries = paymentSummaries;
    }

    public void setBalanceId(Long id) {
    }
}
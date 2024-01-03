package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Balance;
import com.SYNTIARO_POS_SYSTEM.Entity.Bill;
import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import com.SYNTIARO_POS_SYSTEM.Repository.BalanceRepository;
import com.SYNTIARO_POS_SYSTEM.Repository.BillRepo;
import com.SYNTIARO_POS_SYSTEM.Repository.StoreRepository;
import com.SYNTIARO_POS_SYSTEM.Request.PaymentSummary;
import com.SYNTIARO_POS_SYSTEM.Response.BalanceWithPaymentSummaryResponse;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class BalanceService {
    @Autowired
    private BalanceRepository balanceRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    BillRepo billRepo;

    private Map<Integer, LocalDateTime> lastUsedTimeMap = new HashMap<>();

    //THIS METHOD IS USE FOR ADD AMOUNT IN CLOSING BALANCE
    @Transactional
    public void addToClosingBalance(Float additionalAmount) {
        if (additionalAmount == null || additionalAmount <= 0.0f) {
            throw new IllegalArgumentException("Additional amount must be positive");
        }
        Balance latestBalance = balanceRepository.findTopByOrderByDateDesc();
        if (latestBalance == null) {
            throw new RuntimeException("No existing balance records");
        }
        Double newClosingBalance = latestBalance.getRemaining_Balance() + additionalAmount;
        latestBalance.setRemaining_Balance(newClosingBalance);
        try {
            balanceRepository.save(latestBalance);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to update balance record");
        }
    }


    //THIS METHOD IS USE FOR SUBTRACT AMOUNT IN CLOSING BALANCE
    @Transactional
    public void subtractFromClosingBalance(Float subtractAmount) {
        if (subtractAmount == null || subtractAmount <= 0.0f) {
            throw new IllegalArgumentException("Subtract amount must be a positive value");
        }
        Balance latestBalance = balanceRepository.findTopByOrderByDateDesc();

        if (latestBalance == null) {
            throw new RuntimeException("No existing balance records");
        }
        Double currentClosingBalance = latestBalance.getRemaining_Balance();

        if (currentClosingBalance < subtractAmount) {
            throw new IllegalArgumentException("Insufficient balance to subtract");
        }
        Double newClosingBalance = currentClosingBalance - subtractAmount;
        latestBalance.setRemaining_Balance(newClosingBalance);
        try {
            balanceRepository.save(latestBalance);
        } catch (Exception e) {
            // Instead of just printing the stack trace, you should consider proper logging
            e.printStackTrace();
            throw new RuntimeException("Failed to update balance record");
        }
    }

    //THIS METHOD IS USE FOR GET TOTAL CLOSING BALANCE
    public Float getClosingBalanceForDay(LocalDate day) {
        return balanceRepository.getClosingBalanceForDay(day);
    }


    //THIS METHOD IS USE FOR CALCULATE OPENING BALANCE + CASH = TOTAL CLOSING BALANCE IT SHOW WHOLE LIST OF BALANCE OF DB
    public List<BalanceWithPaymentSummaryResponse> getAllBalancesWithPaymentSummaries() {
        List<Balance> balances = balanceRepository.findAll();
        List<BalanceWithPaymentSummaryResponse> responseList = new ArrayList<>();

        Double cumulativeOpeningBalance = 0.0; // Initialize cumulative opening balance

        for (Balance balance : balances) {
            BalanceWithPaymentSummaryResponse response = new BalanceWithPaymentSummaryResponse();
            response.setId(balance.getId());
            response.setDate(balance.getDate());
           // Calculate cumulative opening balance
            cumulativeOpeningBalance += balance.getTodays_opening_Balance();

            // Get bills for the specific day
            List<Bill> bills = billRepo.findByBilldate(balance.getDate());

            // Calculate total cash amount for the specific day
            Float totalAmountCash = calculateTotalAmountForPaymentModes(bills, "cash");

            // Calculate closing balance by adding opening balance, total cash amount, and other amounts
            Double closingBalance = cumulativeOpeningBalance + totalAmountCash;
            response.setOpeningBalance(Float.valueOf(String.valueOf(cumulativeOpeningBalance)));
            response.setClosingBalance(Float.valueOf(String.valueOf(closingBalance)));
            response.setStore_id(balance.getStore_id());
            List<PaymentSummary> paymentSummaries = new ArrayList<>();
            paymentSummaries.add(new PaymentSummary("cash", totalAmountCash));
            response.setPaymentSummaries(paymentSummaries);
            responseList.add(response);
        }
        return responseList;
    }
    private Float calculateTotalAmountForPaymentModes(List<Bill> bills, String paymentMode) {
        return bills.stream()
                .filter(bill -> paymentMode.equals(bill.getPaymentmode()))
                .map(bill -> Float.valueOf(bill.getTotal()))
                .reduce(0.0f, Float::sum);
    }


    /*------------------------CHANGES MADE BY TRUPTI--------------------------*/
    //THIS METHOD IS USE FOR CALCULATE OPENING BALANCE + CASH = TOTAL CLOSING BALANCE
    public Double getClosingBalanceForDateAndStoreId(LocalDate date, Integer store_id) {
        List<Balance> balances = (List<Balance>) balanceRepository.findByDateAndStoreId(date, store_id);
        for (Balance balance : balances) {
            Double closingbalance = balance.getFinal_closing_balance();

            return closingbalance;
        }
        return null;
    }


    private Float calculateTotalAmountForPaymentMode(List<Bill> bills, String paymentMode) {
        return bills.stream()
                .filter(bill -> paymentMode.equals(bill.getPaymentmode()))
                .map(bill -> Float.valueOf(bill.getTotal()))
                .reduce(0.0f, Float::sum);
    }

    //THIS METHOD IS USE FOR FETCH BALANCE BY STOREID
    public List<Balance> getBalanceByStoreId(Integer store_id) {
        return balanceRepository.findByStoreid(store_id);
    }


    // Schedule this task at midnight daily
    @Scheduled(cron = "0 0 0 * * *")
    public void updateRemainingBalancesForAllStores() {
        LocalDateTime currentDate = LocalDateTime.now();

        List<Store> stores = storeRepository.findAll();
        List<Long> storeIds = stores.stream()
                .map(Store::getStoreid)
                .collect(Collectors.toList());
        System.out.println(storeIds+"vfhy");

        for (Long storeId : storeIds) {
            // Get the last recorded balance for the specific store
            Balance lastBalance = balanceRepository.findTopByStoreIdForYesterday(Math.toIntExact(storeId));

            Balance currentBalance = balanceRepository.findByStoreIdAndToday(Math.toIntExact(storeId), LocalDate.now());

            if(currentBalance == null){

            if (lastBalance != null && !lastBalance.getDate().equals(currentDate)) {
                // Calculate and set the remaining balance


                if(lastBalance.getFinal_closing_balance() != null){

                    double todaysOpeningBalance = lastBalance.getFinal_closing_balance();
                    double remainingBalance = lastBalance.getFinal_closing_balance() ;

                    // Create a new balance entry for the current day
                    Balance newBalance = new Balance();
                    newBalance.setDate(LocalDate.from(currentDate));
                    newBalance.setTodays_opening_Balance(todaysOpeningBalance);
                    newBalance.setRemaining_Balance( remainingBalance);
                    newBalance.setStore_id(Math.toIntExact(storeId)); // Set the current store ID
                    newBalance.setUpdateddate(String.valueOf(LocalDateTime.now()));
                    newBalance.setCreateddate(String.valueOf(LocalDateTime.now()));

                    balanceRepository.save(newBalance);
                }
                else {

                    Double todaysOpeningBalance = lastBalance.getRemaining_Balance();
                    Double remainingBalance = lastBalance.getRemaining_Balance();

                    // Create a new balance entry for the current day
                    Balance newBalance = new Balance();
                    newBalance.setDate(LocalDate.from(currentDate));
                    newBalance.setTodays_opening_Balance(todaysOpeningBalance);
                    newBalance.setRemaining_Balance(remainingBalance);
                    newBalance.setStore_id(Math.toIntExact(storeId)); // Set the current store ID

                    balanceRepository.save(newBalance);
                }
            }
        }
        }
    }


}

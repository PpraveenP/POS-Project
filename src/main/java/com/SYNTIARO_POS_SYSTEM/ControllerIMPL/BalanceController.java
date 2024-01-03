package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Balance;
import com.SYNTIARO_POS_SYSTEM.Entity.TransactionRecord;
import com.SYNTIARO_POS_SYSTEM.Repository.BalanceRepository;
import com.SYNTIARO_POS_SYSTEM.Repository.TransactionRecordRepository;
import com.SYNTIARO_POS_SYSTEM.Request.BalanceRequest;
import com.SYNTIARO_POS_SYSTEM.Response.BalanceWithPaymentSummaryResponse;
import com.SYNTIARO_POS_SYSTEM.ServiceIMPL.BalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/sys/api/balance")
public class BalanceController {

    @Autowired
    BalanceService balanceService;

    @Autowired
    BalanceRepository balanceRepository;


    @Autowired
    TransactionRecordRepository transactionRecordRepository;

    @PatchMapping("/start-new-day")
    public ResponseEntity<String> startNewDay(@RequestBody BalanceRequest balanceRequest) {
        if (balanceRequest == null) {
            return ResponseEntity.badRequest().body("Invalid request");
        }

        LocalDate today = LocalDate.now();
        Balance existingBalance = balanceRepository.findByStoreIdAndDate(balanceRequest.getStore_id(), today);
        Balance newBalance = new Balance();

        System.out.println(balanceRequest.getStore_id());
        System.out.println(today);

//        if(existingBalance.getFinal_closing_balance() != null){
//            return ResponseEntity.badRequest().body(" After Final closing you dont have access");
//        }

        if (existingBalance == null) {
            Double addMoreAmount = Double.valueOf(balanceRequest.getAddmoreamounts());
            if (addMoreAmount == null) {
                return ResponseEntity.badRequest().body("Invalid addMoreAmount value");
            }
            newBalance.setAddmoreamount(addMoreAmount);
            newBalance.setRemaining_Balance(addMoreAmount);
            newBalance.setStore_id(balanceRequest.getStore_id());
            newBalance.setTodays_opening_Balance(addMoreAmount);
            newBalance.setCreatedby(balanceRequest.getCreatedby());
            newBalance.setUpdatedby(balanceRequest.getUpdatedby());
            newBalance.setCreateddate(String.valueOf(LocalDateTime.now()));
            newBalance.setUpdateddate(String.valueOf(LocalDateTime.now()));
            balanceRepository.save(newBalance);

            return ResponseEntity.ok("Balance added successfully for the new day!!! Today's Opening Balance: ");

        } else if (existingBalance.getAddmoreamount() != null) {

            if(existingBalance.getFinal_closing_balance() != null){
                return ResponseEntity.badRequest().body(" After Final closing you dont have access");
            }

            Double addMoreAmount = balanceRequest.getAddmoreamounts();
            if (addMoreAmount == null) {
                return ResponseEntity.badRequest().body("Invalid addMoreAmount value");
            }
            newBalance.setId(existingBalance.getId());
            newBalance.setStore_id(balanceRequest.getStore_id());
            newBalance.setAddmoreamount(addMoreAmount + existingBalance.getAddmoreamount());
            newBalance.setRemaining_Balance(addMoreAmount  + existingBalance.getRemaining_Balance());
            newBalance.setTodays_opening_Balance(existingBalance.getTodays_opening_Balance());
            newBalance.setUpdateddate(String.valueOf(LocalDateTime.now()));
            newBalance.setCreateddate(existingBalance.getCreateddate());
            newBalance.setCreatedby(existingBalance.getCreatedby());
            newBalance.setUpdatedby(balanceRequest.getUpdatedby());

            balanceRepository.save(newBalance);


            TransactionRecord endOfDayTransaction = new TransactionRecord();
            endOfDayTransaction.setDate(LocalDate.now()); // Set the date to the current date
            endOfDayTransaction.setCashier(balanceRequest.getCreatedby());
            endOfDayTransaction.setStore_id(balanceRequest.getStore_id());
            endOfDayTransaction.setStatus(("Credited"));
            endOfDayTransaction.setExpense(balanceRequest.getCreatedby());
            endOfDayTransaction.setAmount(balanceRequest.getAddmoreamounts());

            // Save the end-of-day transaction entry to the database
            transactionRecordRepository.save(endOfDayTransaction);
            return ResponseEntity.ok("Balance is added for this store ID for today.");

        }

        else {

            if(existingBalance.getFinal_closing_balance() != null){
                return ResponseEntity.badRequest().body(" After Final closing you dont have access");
            }

            Double addMoreAmount = balanceRequest.getAddmoreamounts();
            if (addMoreAmount == null) {
                return ResponseEntity.badRequest().body("Invalid addMoreAmount value");
            }
            newBalance.setId(existingBalance.getId());
            newBalance.setStore_id(balanceRequest.getStore_id());
            newBalance.setAddmoreamount(addMoreAmount );
            newBalance.setRemaining_Balance(addMoreAmount  + existingBalance.getRemaining_Balance());
            newBalance.setTodays_opening_Balance(existingBalance.getTodays_opening_Balance());
            newBalance.setUpdateddate(String.valueOf(LocalDateTime.now()));
            newBalance.setCreateddate(existingBalance.getCreateddate());
            newBalance.setCreatedby(existingBalance.getCreatedby());
            newBalance.setUpdatedby(balanceRequest.getUpdatedby());
            balanceRepository.save(newBalance);


            TransactionRecord endOfDayTransaction = new TransactionRecord();
            endOfDayTransaction.setDate(LocalDate.now()); // Set the date to the current date
            endOfDayTransaction.setCashier(balanceRequest.getCreatedby());
            endOfDayTransaction.setStore_id(balanceRequest.getStore_id());
            endOfDayTransaction.setStatus(("Credited"));
            endOfDayTransaction.setExpense(balanceRequest.getCreatedby());
            endOfDayTransaction.setAmount(balanceRequest.getAddmoreamounts());

            // Save the end-of-day transaction entry to the database
            transactionRecordRepository.save(endOfDayTransaction);
            return ResponseEntity.ok("Balance is added for this store ID for today.");

        }
    }



    @PostMapping("/add-to-closing-balance")
    public ResponseEntity<String> addToClosingBalance(@RequestBody Float additionalAmount) {
        balanceService.addToClosingBalance(additionalAmount);
        return ResponseEntity.ok("Amount added to closing balance successfully!!!");
    }
    @PostMapping("/subtract-from-closing-balance")
    public ResponseEntity<String> subtractFromClosingBalance(@RequestBody Float closingBalance) {
        balanceService.subtractFromClosingBalance(closingBalance);
        return ResponseEntity.ok("Amount subtracted from closing balance successfully!!!");
    }
    @GetMapping("/total-closing-balance")
    public ResponseEntity<Float> getTotalClosingBalance() {
        LocalDate presentDay = LocalDate.now();
        Float closingBalance = balanceService.getClosingBalanceForDay(presentDay);
        return ResponseEntity.ok(closingBalance);
    }
    @GetMapping("/with-payment-summaries")
    public ResponseEntity<List<BalanceWithPaymentSummaryResponse>> getAllBalancesWithPaymentSummaries() {
        List<BalanceWithPaymentSummaryResponse> balancesWithSummaries = balanceService
                .getAllBalancesWithPaymentSummaries();
        return ResponseEntity.ok(balancesWithSummaries);
    }
    @GetMapping("/current-closing-balance/{store_id}")
    public ResponseEntity<Double> getCurrentDateClosingBalanceByStoreId(@PathVariable Integer store_id) {
        LocalDate currentDate = LocalDate.now();
        Double closingBalance = balanceService.getClosingBalanceForDateAndStoreId(currentDate, store_id);

        if (closingBalance == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(closingBalance);
    }
    @GetMapping("/balance/{storeId}")
    public ResponseEntity<List<Balance>> getBalanceByStoreId(@PathVariable Integer storeId) {
        List<Balance> balances = balanceService.getBalanceByStoreId(storeId);
        if (balances.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(balances);
    }

    @PostMapping("/addBalance")
    public ResponseEntity<String> addBalance(@RequestBody BalanceRequest balanceRequest) {
        try {
            // Find the existing Balance entity based on some criteria (e.g., store_id, date)
            Balance balance = balanceRepository.findByStoreIdAndDate(balanceRequest.getStore_id(), LocalDate.now());

           // System.out.println(balance);
            if (balance == null) {
                // If no existing entry is found, create a new one
                balance = new Balance();
               // balance.setDate(LocalDate.now());
                balance.setStore_id(balanceRequest.getStore_id());
                // Set the initial balance to 0 if it doesn't exist
                balance.setFinal_amount(0.0);
            }

            // Check if a final closing balance is available
            if (balance.getFinal_closing_balance() != null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Error: Final closing balance is already available.");
            }

            double finalAmount = balanceRequest.getFinal_amount();
            double currentBalance = balance.getRemaining_Balance();
            if (finalAmount > currentBalance) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                 .body("Error: Enter amount is greater than remaining amount.");
            }

            balance.setFinal_amount(finalAmount);
            balance.setFinal_handed_over_to(balanceRequest.getFinal_handed_over_to());
            balance.setFinal_closing_balance(currentBalance - finalAmount);
            balance.setStore_id(balanceRequest.getStore_id());
            balance.setDate(balanceRequest.getDate());
            balance.setCreateddate(balance.getCreateddate());
            balance.setCreatedby(balance.getCreatedby());
            balance.setUpdatedby(balanceRequest.getUpdatedby());

           // double remainingBalance = currentBalance - finalAmount;
           // balance.setRemaining_Balance((float) remainingBalance);
            balanceRepository.save(balance);

            return ResponseEntity.ok("Balance added successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error adding balance: " + e.getMessage());
        }
    }

    @GetMapping("/yesterday-closing-balance/{storeId}")
    public Number getYesterdayClosingBalanceByStoreId(@PathVariable Integer storeId) {
        LocalDate yesterdayDate = LocalDate.now().minusDays(1);
        List<Balance> yesterdayClosingBalance = balanceRepository.findYesterdayClosingBalanceByStoreId(storeId, yesterdayDate);
        if (yesterdayClosingBalance.get(0).getFinal_closing_balance() != null) {
            return yesterdayClosingBalance.get(0).getFinal_closing_balance();
        } else {
            return yesterdayClosingBalance.get(0).getRemaining_Balance();
        }
    }

    @GetMapping("/remaining_balance/{storeId}")
    public Double getRemainingBalance(@PathVariable Integer storeId) {

            LocalDate presentDay = LocalDate.now();
            Balance remainingBalance = balanceRepository.findByStoreIdAndDates(storeId, presentDay);


            balanceService.updateRemainingBalancesForAllStores();
            return remainingBalance.getRemaining_Balance() ;

    }
}
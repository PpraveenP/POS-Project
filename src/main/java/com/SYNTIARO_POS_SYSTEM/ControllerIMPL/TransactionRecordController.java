package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Balance;
import com.SYNTIARO_POS_SYSTEM.Entity.TransactionRecord;
import com.SYNTIARO_POS_SYSTEM.Repository.BalanceRepository;
import com.SYNTIARO_POS_SYSTEM.Repository.TransactionRecordRepository;
import com.SYNTIARO_POS_SYSTEM.Request.TransactionRequest;
import com.SYNTIARO_POS_SYSTEM.ServiceIMPL.TransactionRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/sys/transaction")
public class TransactionRecordController {

    @Autowired
    TransactionRecordRepository transactionRecordRepository;

    @Autowired
    TransactionRecordService recordService;

    @Autowired
    BalanceRepository balanceRepository;



    /*------------------------CHANGES MADE BY TRUPTI--------------------------*/
    // THIS METHOD IS USE FOR ADD CASHIER,EXPENSE & AMOUNT (CLOSING BALANCE GET
    // MINUS AFTER GIVING AMOUNT TO SOMEONE)
    @PostMapping("/end-of-day-close")
    public ResponseEntity<String> endOfDayClose(@RequestBody TransactionRequest request) {
        try {
            // Fetch a list of balances based on the store ID and the current date
            List<Balance> balances = balanceRepository.findAllByStoreIdAndDate(request.getStore_id(), LocalDate.now());

            if(balances.get(0).getFinal_closing_balance()!=null) {
                return ResponseEntity.badRequest().body("After Final Closing You Not Able To Do Process ");
            }
            if (balances.isEmpty()) {
                return ResponseEntity.badRequest().body("Balance not found for store ID: " + request.getStore_id());
            }

            for (Balance balance : balances) {
                // Calculate the new closing balance by subtracting the given amount
                Double currentClosingBalance = balance.getRemaining_Balance();
                 Float givenAmount = request.getAmount();

                if (currentClosingBalance < givenAmount) {
                    return ResponseEntity.badRequest().body("Not sufficient balance for end-of-day close.");
                }

                Double newClosingBalance = currentClosingBalance - givenAmount;

                // Update the closing balance in the balance table
                balance.setRemaining_Balance(newClosingBalance);
                balanceRepository.save(balance);
            }

            // Create a new TransactionRecord object to represent the end-of-day close entry
            TransactionRecord endOfDayTransaction = new TransactionRecord();
            endOfDayTransaction.setDate(LocalDate.now()); // Set the date to the current date
            endOfDayTransaction.setCashier(request.getCashier());
            endOfDayTransaction.setExpense(request.getExpense());
            endOfDayTransaction.setStore_id(request.getStore_id());
            endOfDayTransaction.setStatus(("Debited"));
            endOfDayTransaction.setAmount(Double.valueOf(request.getAmount()));

            // Save the end-of-day transaction entry to the database
            transactionRecordRepository.save(endOfDayTransaction);


            return ResponseEntity.ok("End of day closing successful!!!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error occurred during end-of-day close: " + e.getMessage());
        }
    }


    /*------------------------CHANGES MADE BY TRUPTI--------------------------*/
    // THIS METHOD IS USE FOR GET ALL DATA OF TRANSACTION
    @GetMapping("/all-transactions")
    public ResponseEntity<List<TransactionRecord>> getAllTransactions() {
        try {
            List<TransactionRecord> transactions = transactionRecordRepository.findAll();
            return ResponseEntity.ok(transactions);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }

    }

    /*------------------------CHANGES MADE BY TRUPTI--------------------------*/
    // THIS METHOD IS USE FOR GET DATA OF TRANSACTION BY STOREID
    @GetMapping("/transaction/{storeId}")
    public ResponseEntity<List<TransactionRecord>> getTransactionByStoreId(@PathVariable Integer storeId) {
        List<TransactionRecord> transactionRecords = recordService.getTransactioneByStoreId(storeId);
        if (transactionRecords.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(transactionRecords);
    }

}
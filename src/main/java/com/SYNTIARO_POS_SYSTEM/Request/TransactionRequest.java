package com.SYNTIARO_POS_SYSTEM.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TransactionRequest {
    private LocalDate date = LocalDate.now();
    private Integer store_id;
    private String cashier;
    private String expense;
    private Float amount;

}
package com.SYNTIARO_POS_SYSTEM.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class PaymentSummary {

    private String paymentMode;
    private Float totalAmount;


}

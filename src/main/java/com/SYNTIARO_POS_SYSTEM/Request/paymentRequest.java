package com.SYNTIARO_POS_SYSTEM.Request;

import com.SYNTIARO_POS_SYSTEM.Entity.Payment;
import com.SYNTIARO_POS_SYSTEM.Entity.Vendor;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class paymentRequest {
    private Vendor vendor;
    private Payment payment;
}

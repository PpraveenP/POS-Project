package com.SYNTIARO_POS_SYSTEM.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentWrapper {
    private Long payment_id;
    private String store_id;
    private String vendor_name;
    private Date payment_date;
    private String payment_mode;
    private Date due_date;
    private String vendor_address;
    private Long mobile_no;
    private String bank_name;
    private String Branch;
    private Long account_no;
    private String IFSC_code;
    private String UPI_id;
}

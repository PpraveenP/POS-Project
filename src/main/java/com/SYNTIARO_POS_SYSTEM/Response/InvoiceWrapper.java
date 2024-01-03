package com.SYNTIARO_POS_SYSTEM.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InvoiceWrapper {
    private int store_id;
    private int invoice_id;
    private String item_name;
    private Date invoice_date;
    private String price;
    private String Quantity;
    private String discount;
    private String invoice_status;
    private String payment_status;

}

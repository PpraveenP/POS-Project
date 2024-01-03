package com.SYNTIARO_POS_SYSTEM.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
public class VendorWrapper {
	private Long vendor_id;
	private String vendor_name;
	private String vendor_address;
	private Long mobile_no;
	private String GST_no;
	private String bank_name;
	private String Branch;
	private Long account_no;
	private String IFSC_code;
	private String UPI_id;
}

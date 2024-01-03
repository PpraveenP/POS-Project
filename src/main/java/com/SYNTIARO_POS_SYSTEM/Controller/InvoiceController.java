package com.SYNTIARO_POS_SYSTEM.Controller;

import com.SYNTIARO_POS_SYSTEM.Entity.Invoice;

import com.SYNTIARO_POS_SYSTEM.Response.InvoiceWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

public interface InvoiceController {
	@PostMapping(path = "/postinvoice")
	String saveInvoice(@RequestBody Invoice invoice);
	@PutMapping(path = "/updatess")
	public Invoice updateinvoice(@RequestBody Invoice invoice);
	@GetMapping(path = "/allinvoice")
	List<Invoice> getInvoice();
	@PatchMapping(path = "/updateinvoice/{invoice_id}")
	public ResponseEntity<Invoice> updateInvoice(
			@PathVariable("invoice_id") Integer invoice_id,
			@RequestBody Invoice invoice);

}

package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;


import com.SYNTIARO_POS_SYSTEM.Entity.Invoice;
import com.SYNTIARO_POS_SYSTEM.Repository.InvoiceRepo;
import com.SYNTIARO_POS_SYSTEM.Response.InvoiceWrapper;
import com.SYNTIARO_POS_SYSTEM.Service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class InvoiceServiceIMPL implements InvoiceService {


	@Autowired
	InvoiceRepo invoiceRepo;


	//THIS METHOD IS USE FOR ADD INVOICE
	@Override
	public String addInvoice(Invoice invoice) {
		Integer lastBillNumber = invoiceRepo.findLastNumberForStore(invoice.getStore_id());
		invoice.setInvoice_id(lastBillNumber != null ? lastBillNumber + 1 : 1);
		invoiceRepo.save(invoice);
		return invoice.getItem_name();
	}


	//THIS METHOD IS USE FOR GET ALL LIST OF INVOICE
	@Override
	public List<Invoice> getInvoice() {
		return this.invoiceRepo.findAll();
	}


	//THIS METHOD IS USE FOR UPDATE INVOICE
	@Override
	public Invoice updateInvoice(Invoice invoice) {
		invoiceRepo.save(invoice);
		return invoice;
	}



	// THIS METHOD IS USE FOR FETCH INVOICE BY STOREID
	@Override
	public List<Invoice> fetchInvoicesByStoreId(Integer storeId) {
		return invoiceRepo.findByStore_id(storeId);
	}

	@Override
	public void deleteInvoiceById(Integer invoiceId) {
		Optional<Invoice> invoiceOptional = invoiceRepo.findById(invoiceId);
		if (invoiceOptional.isPresent()) {
			invoiceRepo.deleteById(invoiceId);
		} else {
			throw new EntityNotFoundException("Invoice with ID " + invoiceId + " not found");
		}
	}

	// THIS METHOD IS USE FOR UPDATE INVOICE
	@Override
	public Invoice updateInvoice(Integer invoice_id, Invoice invoice) {
		Optional<Invoice> existingInvoice = invoiceRepo.findById((int) Integer.parseInt(String.valueOf((invoice_id))));
		if (existingInvoice.isPresent()) {
			Invoice updateinvoice = existingInvoice.get();
			if (invoice.getStore_id() != null) {
				updateinvoice.setStore_id(invoice.getStore_id());
			}
			if (invoice.getVendor_name() != null) {
				updateinvoice.setVendor_name(invoice.getVendor_name());
			}
			if (invoice.getItem_name() != null) {
				updateinvoice.setItem_name(invoice.getItem_name());
			}
			if (invoice.getInvoice_date() != null) {
				updateinvoice.setInvoice_date(invoice.getInvoice_date());
			}
			if (invoice.getPrice() != null) {
				updateinvoice.setPrice(invoice.getPrice());
			}
			if (invoice.getQuantity() != null) {
				updateinvoice.setQuantity(invoice.getQuantity());
			}
			if (invoice.getDiscount() != null) {
				updateinvoice.setDiscount(invoice.getDiscount());
			}
			if (invoice.getPayment_status() != null) {
				updateinvoice.setPayment_status(invoice.getPayment_status());
			}
			if (invoice.getTotal() != null) {
				updateinvoice.setTotal(invoice.getTotal());
			}
			if (invoice.getGstno() != null) {
				updateinvoice.setGstno(invoice.getGstno());
			}
			if (invoice.getCreate_date() != null) {
				updateinvoice.setCreateby(invoice.getCreateby());
			}
			if (invoice.getUpdateby() != null) {
				updateinvoice.setUpdateby(invoice.getUpdateby());
			}
			if (invoice.getInventory_code() != null) {
				updateinvoice.setInventory_code(invoice.getInventory_code());
			}
			invoiceRepo.save(updateinvoice);
			return updateinvoice;
		} else {
			return null;
		}
	}
}
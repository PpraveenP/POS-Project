package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Payment;
import com.SYNTIARO_POS_SYSTEM.Repository.PaymentRepo;
import com.SYNTIARO_POS_SYSTEM.Response.PaymentWrapper;
import com.SYNTIARO_POS_SYSTEM.Service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentServiceIMPL implements PaymentService {


	@Autowired
	private PaymentRepo paymentRepo;

	//THIS METHOD IS USE FOR ADD PAYMENT
	@Override
	public String addPayment(Payment payment) {

		Integer lastBillNumber = paymentRepo.findLastNumberForStore(payment.getStore_id());
		System.out.println("pay" +payment.getStore_id());
		System.out.println("hi" +lastBillNumber);
		payment.setPayment_id(lastBillNumber != null ? lastBillNumber + 1 : 1);
		paymentRepo.save(payment);
		return payment.getVendor_name();
	}

	//THIS METHOD IS USE FOR GET LIST OF PAYMENT
	@Override
	public List<Payment> getPayment() {
		return paymentRepo.findAll();
	}

    //THIS METHOD IS USE FOR UPDATE PAYMENT
	@Override
	public Payment updatedPayment(Payment payment) {
		paymentRepo.save(payment);
		return payment;
	}

	public Payment getPaymentById(Integer Serial_no) {
		return paymentRepo.findByPaymentId(Serial_no);
	}


	// THIS METHOD IS USE FOR FETCH PAYMENT BY STOREID
	@Override
	public List<Payment> fetchPaymentsByStoreId(Integer storeId) {
		return paymentRepo.findByStore_id(storeId);
	}

	// THIS METHOD IS USE FOR UPDATE PAYMENT
	@Override
	public Payment updatePayment(Integer payment_id, Payment payment) {
		Optional<Payment> existingPayment = paymentRepo.findById((int) Integer.parseInt(String.valueOf((payment_id))));
		if (existingPayment.isPresent()) {
			Payment updatepayment = existingPayment.get();

			if (payment.getStore_id() != null) {
				updatepayment.setStore_id(payment.getStore_id());
			}
			if (payment.getVendor_name() != null) {
				updatepayment.setVendor_name(payment.getVendor_name());
			}
			if (payment.getGst() != null) {
				updatepayment.setGst(payment.getGst());
			}
			if (payment.getPayment_mode() != null) {
				updatepayment.setPayment_mode(payment.getPayment_mode());
			}
			if (payment.getDue_date() != null) {
				updatepayment.setDue_date(payment.getDue_date());
			}
			if (payment.getBank_name() != null) {
				updatepayment.setBank_name(payment.getBank_name());
			}
			if (payment.getBranch() != null) {
				updatepayment.setBranch(payment.getBranch());
			}
			if (payment.getAccount_no() != null) {
				updatepayment.setAccount_no(payment.getAccount_no());
			}
			if (payment.getIfsc_code() != null) {
				updatepayment.setIfsc_code(payment.getIfsc_code());
			}
//			if (payment.getUpi_id() != null) {
//				updatepayment.setUpi_id("upi://pay?pa="+payment.getUpi_id());
//			}

			if (payment.getUpi_id() != null) {
				updatepayment.setUpi_id(payment.getUpi_id());
			}

			if (payment.getTotal() != null) {
				updatepayment.setTotal(payment.getTotal());
			}
			if (payment.getCreatby() != null) {
				updatepayment.setCreatby(payment.getCreatby());
			}
			if (payment.getUpdateby() != null) {
				updatepayment.setUpdateby(payment.getUpdateby());
			}
			if (payment.getPayment_status() != null) {
				updatepayment.setPayment_status(payment.getPayment_status());
			}
			if(payment.getPayment_date()!= null){
				updatepayment.setPayment_date(payment.getPayment_date());
			}

			paymentRepo.save(updatepayment);
			return updatepayment;
		} else {
			return null;
		}
	}


	@Override
	public Payment PaymentGatway(Integer payment_id, Payment payment) {
		Optional<Payment> existingPayment = paymentRepo.findById((int) Integer.parseInt(String.valueOf((payment_id))));
		if (existingPayment.isPresent()) {
			Payment updatepayment = existingPayment.get();

			if (payment.getStore_id() != null) {
				updatepayment.setStore_id(payment.getStore_id());
			}
			if (payment.getVendor_name() != null) {
				updatepayment.setVendor_name(payment.getVendor_name());
			}
			if (payment.getGst() != null) {
				updatepayment.setGst(payment.getGst());
			}
			if (payment.getPayment_mode() != null) {
				updatepayment.setPayment_mode(payment.getPayment_mode());
			}
			if (payment.getDue_date() != null) {
				updatepayment.setDue_date(payment.getDue_date());
			}
			if (payment.getBank_name() != null) {
				updatepayment.setBank_name(payment.getBank_name());
			}
			if (payment.getBranch() != null) {
				updatepayment.setBranch(payment.getBranch());
			}
			if (payment.getAccount_no() != null) {
				updatepayment.setAccount_no(payment.getAccount_no());
			}
			if (payment.getIfsc_code() != null) {
				updatepayment.setIfsc_code(payment.getIfsc_code());
			}
			if (payment.getTotal() != null) {
				updatepayment.setTotal(payment.getTotal());
			}
			if (payment.getCreatby() != null) {
				updatepayment.setCreatby(payment.getCreatby());
			}
			if (payment.getUpdateby() != null) {
				updatepayment.setUpdateby(payment.getUpdateby());
			}
			if (payment.getPayment_status() != null) {
				updatepayment.setPayment_status(payment.getPayment_status());
			}

			paymentRepo.save(updatepayment);
			return updatepayment;
		} else {
			return null;
		}
	}



}

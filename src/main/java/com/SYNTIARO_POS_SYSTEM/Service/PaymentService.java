package com.SYNTIARO_POS_SYSTEM.Service;

import com.SYNTIARO_POS_SYSTEM.Entity.Payment;
import com.SYNTIARO_POS_SYSTEM.Response.PaymentWrapper;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface PaymentService {

	List<Payment> getPayment();

	public Payment updatedPayment(Payment payment);

	String addPayment(Payment payment);

	// THIS METHOD IS USE FOR UPDATE PAYMENT
	Payment updatePayment(Integer payment_id, Payment payment);

	Payment PaymentGatway(Integer payment_id, Payment payment);

	// THIS METHOD IS USE FOR FETCH PAYMENT BY STOREID
	List<Payment> fetchPaymentsByStoreId(Integer storeId);

	// THIS METHOD IS USE FOR FETCH PAYMENT BY ID
	Payment getPaymentById(Integer Serial_no);
}


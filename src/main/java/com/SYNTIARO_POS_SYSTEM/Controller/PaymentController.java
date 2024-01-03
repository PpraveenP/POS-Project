package com.SYNTIARO_POS_SYSTEM.Controller;

import com.SYNTIARO_POS_SYSTEM.Entity.Payment;

import com.SYNTIARO_POS_SYSTEM.Response.PaymentWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/sys/Payment")
public interface PaymentController {
    @PostMapping(path = "/postpayment")
    public String savePayment(@RequestBody Payment payment);
    @GetMapping(path = "/all_payment")
    List<Payment> getAllPayment();

    @PutMapping(path = "/updatepayment")
    public Payment updatedpayment(@RequestBody Payment payment);

    @PatchMapping(path = "/updatePayment/{payment_id}")
    public ResponseEntity<Payment> updatePayment(
            @PathVariable("payment_id") Integer payment_id,
            @RequestBody Payment payment);

    @PatchMapping(path = "/gatwayPayment/{payment_id}")
    public ResponseEntity<Payment> Paymentgatway(
            @PathVariable("payment_id") Integer payment_id,
            @RequestBody Payment payment);

}

package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.StorePayment;
import com.SYNTIARO_POS_SYSTEM.Repository.StorePaymentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import net.glxn.qrgen.QRCode;
import net.glxn.qrgen.image.ImageType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;

import javax.servlet.http.HttpServletResponse;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/sys/api/store-payments")
public class StorePaymentControllerIMPL {

    @Autowired
    private StorePaymentRepository storePaymentRepository;

    @Autowired
    private ObjectMapper objectMapper;


    @PostMapping("/save")
    public ResponseEntity<StorePayment> createStorePayment(@RequestBody StorePayment storePayment) {
        // Set the createdDate using LocalDateTime
        storePayment.setCreatedDate(String.valueOf(new Date()));
        try {
            // Get the last paymentId for the store
            Long lastPaymentId = storePaymentRepository.findMaxPaymentIdByStoreId(storePayment.getStoreId());
            // Generate the new paymentId
            storePayment.setPaymentId((lastPaymentId != null) ? lastPaymentId + 1 : 1);
            // Save the StorePayment
            StorePayment createdStorePayment = storePaymentRepository.save(storePayment);
            return ResponseEntity.ok(createdStorePayment);
        } catch (Exception e) {
            // Handle exceptions (e.g., database errors)
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // THIS METHOD IS USE FOR GETALL STOREPAYMENT
    @GetMapping("/getAll")
    public ResponseEntity<List<StorePayment>> getAllStorePayments() {
        List<StorePayment> storePayments = storePaymentRepository.findAll();
        return ResponseEntity.ok(storePayments);
    }

    //////////// rushikesh add this new code///

    // for upi payment code //
    @GetMapping("/getupi/{storeId}")
    public ResponseEntity<String> getUpiByStoreId(@PathVariable Long storeId) {
        List<StorePayment> storePayments = storePaymentRepository.findByStoreId(storeId);
        if (!storePayments.isEmpty()) {
            // Assuming you want to return the UPI ID for the first store payment in the
            // list.
            String upiId = storePayments.get(0).getUpiId();
            return ResponseEntity.ok(upiId);
        } else {
            // Handle the case where the store payment for the given store ID is not found.
            return ResponseEntity.notFound().build();
        }
    }

    // THIS METHOD IS USE FOR GETBYID STOREPAYMENT
    @GetMapping("/{paymentId}")
    public ResponseEntity<StorePayment> getStorePaymentById(@PathVariable Long paymentId) {
        StorePayment storePayment = storePaymentRepository.findById(paymentId).orElse(null);
        if (storePayment != null) {
            return ResponseEntity.ok(storePayment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // THIS METHOD IS USE FOR UPDATE STOREPAYMENT
    @PatchMapping("/updatestorepayment/{paymentId}")
    public ResponseEntity<String> updateStorePayment(@PathVariable Long paymentId,
            @RequestBody Map<String, Object> updates) {
        StorePayment storePayment = storePaymentRepository.findById(paymentId).orElse(null);

        if (storePayment == null) {
        }
        try {
            // Apply updates to the entity using ObjectMapper
            objectMapper.readerForUpdating(storePayment).readValue(objectMapper.writeValueAsBytes(updates));

            // Manually update the updatedDate field
            storePayment.setUpdatedDate(String.valueOf(new Date()));

            // Save the updated entity
            storePaymentRepository.save(storePayment);

            return ResponseEntity.ok("Store Payment updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating Store Payment.");
        }
    }

    // THIS METHOD IS USE FOR DELETE STOREPAYMENT
    @DeleteMapping("/deletestorepayment/{paymentId}")
    public ResponseEntity<String> deleteStorePayment(@PathVariable Long paymentId) {
        storePaymentRepository.deleteById(paymentId);
        return ResponseEntity.ok("Store Payment deleted successfully.");
    }

    // THIS METHOD IS USE FOR GET STOREPAYMENTS BY STORE ID
    @GetMapping("/storepayment/{storeId}")
    public ResponseEntity<List<StorePayment>> getStorePaymentsByStoreId(@PathVariable Long storeId) {
        List<StorePayment> storePayments = storePaymentRepository.findByStoreId(storeId);

        if (!storePayments.isEmpty()) {
            return ResponseEntity.ok(storePayments);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ------------------------- THIS COD FOR GENRATE OR CODE-------------------
    @GetMapping("/generateQRCode") // -------------MADE BY RUSHIKESH
    @ResponseBody
    public void generateQRCode(@RequestParam String text, HttpServletResponse response) throws IOException {
        // Generate the QR code as a byte array
        byte[] qrCodeBytes = QRCode.from(text).to(ImageType.PNG).stream().toByteArray();

        // Set the response headers
        response.setContentType("image/png");
        response.setContentLength(qrCodeBytes.length);
        // Write the QR code image to the response output stream
        response.getOutputStream().write(qrCodeBytes);
        response.getOutputStream().flush();
    }

}

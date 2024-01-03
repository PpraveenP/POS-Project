package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Controller.PaymentController;
import com.SYNTIARO_POS_SYSTEM.Entity.Payment;
import com.SYNTIARO_POS_SYSTEM.Repository.PaymentRepo;
import com.SYNTIARO_POS_SYSTEM.Request.paymentRequest;
import com.SYNTIARO_POS_SYSTEM.Service.PaymentService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import net.glxn.qrgen.QRCode;
import net.glxn.qrgen.image.ImageType;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/sys/Payment")
public class PaymentControllerIMPL implements PaymentController {

    @Autowired
    PaymentService paymentService;

    @Autowired
    PaymentRepo paymentRepo;

    // THIS METHOD IS USE FOR POST PAYMENT
    @Override
    public String savePayment(Payment payment) {
//        payment.setUpi_id("upi://pay?pa="+payment.getUpi_id());
        payment.setUpi_id(payment.getUpi_id());
        return paymentService.addPayment(payment);
    }

    // THIS METHOD IS USE FOR GET ALL LIST OF PAYMENT
    @Override
    public List<Payment> getAllPayment() {
        return this.paymentService.getPayment();
    }

    // THIS METHOD IS USE FOR UPDATE PAYMENT
    @Override
    public Payment updatedpayment(Payment payment) {
        return this.paymentService.updatedPayment(payment);
    }

    // THIS METHOD IS USE FOR POST PAYMENT
    @PostMapping(path = "/payments")
    public Payment placepayment(@RequestBody paymentRequest request) {
        Integer lastBillNumber = paymentRepo.findLastNumberForStore(request.getPayment().getStore_id());
        System.out.println("hi" +lastBillNumber);
       // request.getPayment().setUpi_id("upi://pay?pa="+request.getPayment().getUpi_id());
        request.getPayment().setUpi_id(request.getPayment().getUpi_id());
        request.getPayment().setPayment_id(lastBillNumber != null ? lastBillNumber + 1 : 1);
        return paymentRepo.save(request.getPayment());
    }

    // THIS METHOD IS USE FOR UPDATE PAYMENT
    @Override
    public ResponseEntity<Payment> updatePayment(Integer payment_id, Payment payment) {
        try {
            Payment updatePayment = paymentService.updatePayment(payment_id, payment);
            if (updatePayment != null) {
                return new ResponseEntity<>(updatePayment, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



 // this method paymentgatway
    @Override
    public ResponseEntity<Payment> Paymentgatway(Integer payment_id, Payment payment) {
        try {
            Payment updatePayment = paymentService.PaymentGatway(payment_id, payment);
            if (updatePayment != null) {
                return new ResponseEntity<>(updatePayment, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // THIS METHOD IS USE FOR FETCH PAYMENT BY STOREID
    @GetMapping("/payments/{storeId}")
    public List<Payment> getPaymentsByStoreId(@PathVariable Integer storeId) {
        return paymentService.fetchPaymentsByStoreId(storeId);
    }

    // THIS METHOD IS USE FOR FETCH PAYMENT BY ID
    @GetMapping("/{Serial_no}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Integer Serial_no) {
        Payment payment = paymentService.getPaymentById(Serial_no);
        if (payment != null) {
            return ResponseEntity.ok(payment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{paymentId}")
    public ResponseEntity<String> deletePayment(@PathVariable Integer paymentId) {
        Optional<Payment> optionalPayment = paymentRepo.findById((paymentId));
        if (optionalPayment.isPresent()) {
            Payment payment = optionalPayment.get();
            paymentRepo.delete(payment);
            return ResponseEntity.ok("Payment deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/excelpayment/{storeId}")
    public ResponseEntity<byte[]> generateExcelByStoreId(@PathVariable Integer storeId) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Invoice Data");
            Row headerRow = sheet.createRow(0);
            String[] headerss = { "Payment Id", "Vendor Name", "Payment Date", "payment_mode", "Bank_name",
                    "Account no", "Branch", "IFSC code", "total" };
            for (int i = 0; i < headerss.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headerss[i]);
            }
            List<Payment> Lists = paymentRepo.findByStore_id(storeId);
            int rowNum = 1;
            for (Payment List : Lists) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(List.getPayment_id());
                row.createCell(1).setCellValue(List.getVendor_name());
                row.createCell(2).setCellValue(List.getPayment_date());
                row.createCell(3).setCellValue(List.getPayment_mode());
                row.createCell(4).setCellValue(List.getBank_name());
                row.createCell(5).setCellValue(List.getAccount_no());
                row.createCell(6).setCellValue(List.getBranch());
                row.createCell(7).setCellValue(List.getIfsc_code());
                row.createCell(8).setCellValue(List.getTotal());
            }
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "Payment_Data.xlsx");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(outputStream.toByteArray());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/excelpayment/")
    public ResponseEntity<byte[]> generateExcelByStoreIdWithDateRange(
            @RequestParam Integer store_id,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String endDate) {

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Payment Data");
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "Payment Id", "Vendor Name", "Payment Date", "Payment Mode",
                    "Bank Name", "Account No", "Branch", "IFSC Code", "Total"
            };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            List<Payment> paymentsList = paymentRepo.findByStoreIdAndDateRange(store_id, startDate, endDate);
            int rowNum = 1;

            for (Payment payment : paymentsList) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(payment.getPayment_id());
                row.createCell(1).setCellValue(payment.getVendor_name());
                row.createCell(2).setCellValue(payment.getPayment_date());
                row.createCell(3).setCellValue(payment.getPayment_mode());
                row.createCell(4).setCellValue(payment.getBank_name());
                row.createCell(5).setCellValue(payment.getAccount_no());
                row.createCell(6).setCellValue(payment.getBranch());
                row.createCell(7).setCellValue(payment.getIfsc_code());
                row.createCell(8).setCellValue(payment.getTotal());
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            HttpHeaders headerss = new HttpHeaders();
            headerss.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headerss.setContentDispositionFormData("attachment", "Payment_Data.xlsx");

            return ResponseEntity.ok()
                    .headers(headerss)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(outputStream.toByteArray());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/generateQRCode/{paymentid}")
    public ResponseEntity<byte[]> generateQRCode(@PathVariable Integer paymentid) {
        try {
            // Get the vendor's UPI ID based on the vendorId
            String upiId = getUpiIdForVendor(paymentid);
            String total = getUpiIdForVendortotal((paymentid));
            // Generate a QR code for the UPI ID
            byte[] qrCodeBytes = generateQRCodeForUPI("upi://pay?pa="+upiId+"&am="+total+"&cu=INR");
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            return new ResponseEntity<>(qrCodeBytes, headers, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public byte[] generateQRCodeForUPI(String upiId) throws IOException {
        // Generate a QR code for the UPI ID
        ByteArrayOutputStream stream = QRCode.from(upiId).to(ImageType.PNG).stream();
        // Convert the ByteArrayOutputStream to a byte array
        byte[] qrCodeBytes = stream.toByteArray();
        return qrCodeBytes;
    }

    // Implement this method to retrieve the UPI ID for a vendor based on the vendor
    // ID
    private String getUpiIdForVendor(Integer vendorId) {
        // Call a service method to fetch the UPI ID based on the vendor ID
        Payment payment = paymentRepo.findById(vendorId).orElse(null);
        return payment.getUpi_id();
    }

    private String getUpiIdForVendortotal(Integer vendorId) {
        // Call a service method to fetch the UPI ID based on the vendor ID
        Payment payment = paymentRepo.findById(vendorId).orElse(null);
        return payment.getTotal();
    }

    @PostMapping("/generate-pdf-payment/")
    public ResponseEntity<?> generatePDF(
            @RequestParam Integer store_id,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String endDate) throws DocumentException {
        List<Payment> paymentList;
        Date startDates = null;
        Date endDates = null;

        if (store_id != null) {
            // Fetch payments for a specific store ID
            paymentList = paymentRepo.findByStoreIdAndCreatedDateBetween(store_id , startDate , endDate);

        } else if (startDate != null && endDate != null) {
            try {
                // Parse date strings into java.util.Date
                SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
                startDates = dateFormat.parse(String.valueOf(startDate));
                endDates = dateFormat.parse(String.valueOf(endDate));
            } catch (ParseException ex) {
                // Handle the parsing error here, e.g., return an error response
                return ResponseEntity.badRequest().body("Invalid date format");
            }

            // Filter the stores based on the date range
            paymentList = paymentRepo.findByStoreIdAndCreatedDateBetween(store_id, startDate, endDate);
        } else {
            // If no date range is specified, retrieve all stores
            paymentList = paymentRepo.findAll();
        }

        if (paymentList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();

        Paragraph title = new Paragraph("PAYMENT DETAILS" , new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD));
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);// Add spacing between title and table


        Paragraph spacing = new Paragraph(" "); // Empty paragraph
        spacing.setSpacingAfter(10f); // Adjust the spacing as needed
        document.add(spacing);



        PdfPTable table = new PdfPTable(11); // Number of columns
        table.setWidthPercentage(100);

        PdfPCell cell = new PdfPCell(new Phrase("Payment Id", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Vendor Name", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Payment Mode", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Payment Status", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Payment Date", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Due Date", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Bank Name", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Branch", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Account No", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("IFSC Code", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Total ₹", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        ;

        for (Payment payment : paymentList) {
            table.addCell(String.valueOf(payment.getPayment_id()));
            table.addCell(payment.getVendor_name());
            table.addCell(payment.getPayment_mode());
            table.addCell(payment.getPayment_status());
            table.addCell(payment.getPayment_date());
            table.addCell(String.valueOf(payment.getDue_date()));
            table.addCell(payment.getBank_name());
            table.addCell(payment.getBranch());
            table.addCell(String.valueOf(payment.getAccount_no()));
            table.addCell(payment.getIfsc_code());
            table.addCell(payment.getTotal());

        }

        document.add(table);

        document.close();

        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Store-details.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(byteArrayInputStream));
    }




}

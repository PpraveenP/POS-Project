package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Customer_Details;
import com.SYNTIARO_POS_SYSTEM.Entity.Invoice;
import com.SYNTIARO_POS_SYSTEM.Repository.CustomerRepo;
import com.SYNTIARO_POS_SYSTEM.Response.MessageResponse;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
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
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/sys/customer")
public class CustomerController {

    @Autowired
    CustomerRepo customerRepo;
    @PostMapping("/savecustomer")
    public  ResponseEntity<?> addCustomer(@RequestBody Customer_Details customerDetails) {

        if (customerRepo.existsBycustomername(customerDetails.getCustomername())) {
        return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (customerRepo.existsByContact(customerDetails.getContact())) {
        return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Contact Number is already taken!"));
        }

        if (customerRepo.existsByEmail(customerDetails.getEmail())) {
        return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already taken!"));
        }

        Integer lastBillNumbers = customerRepo.findMaxVendorIdByStoreId(customerDetails.getStore_id());
        customerDetails.setCustomer_id(lastBillNumbers != null ? lastBillNumbers + 1 : 1);
        customerRepo.save(customerDetails);
       // return customerDetails.getCustomer_name();

        return ResponseEntity.ok(new MessageResponse("Data Save Succesfully"));
    }

    @GetMapping("/getcustomer/{storeId}")
    public ResponseEntity<List<Customer_Details>> getCustomerByStoreId(@PathVariable Integer storeId) {
        try {
            List<Customer_Details> customerDetails = customerRepo.findByStore_id(storeId);
            if (customerDetails.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(customerDetails, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/generate-pdf-customer/")
    public ResponseEntity<?> generatePDF(
            @RequestParam Integer store_id,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String endDate) throws DocumentException {
        List<Customer_Details> customerlist;
        Date startDates = null;
        Date endDates = null;

        if (store_id != null) {
            // Fetch payments for a specific store ID
            customerlist = customerRepo.findByStoreIdAndDateRange(store_id , startDate , endDate);

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
            customerlist = customerRepo.findByStoreIdAndDateRange(store_id , startDate , endDate);
        } else {
            // If no date range is specified, retrieve all stores
            customerlist = customerRepo.findByStoreIdAndDateRange(store_id , startDate , endDate);
        }

        if (customerlist.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();

        Paragraph title = new Paragraph("VENDOR_INVENTORY_DETAILS" , new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD));
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);// Add spacing between title and table


        Paragraph spacing = new Paragraph(" "); // Empty paragraph
        spacing.setSpacingAfter(10f); // Adjust the spacing as needed
        document.add(spacing);



        PdfPTable table = new PdfPTable(5); // Number of columns
        table.setWidthPercentage(100);

        PdfPCell cell = new PdfPCell(new Phrase("Customer No", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Customer Name", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Email", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Date Of Birth", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Contact No", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);

        ;
        for (Customer_Details invoice : customerlist) {
            table.addCell(String.valueOf(invoice.getCustomer_id()));
            table.addCell(String.valueOf(invoice.getCustomername()));
            table.addCell(invoice.getEmail());
            table.addCell(invoice.getDob());
            table.addCell(invoice.getContact());
                   }

        document.add(table);

        document.close();

        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=VENDOR_INVENTORY_DETAILS.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(byteArrayInputStream));
    }





}

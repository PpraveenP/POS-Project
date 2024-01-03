package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Controller.InvoiceController;
import com.SYNTIARO_POS_SYSTEM.Entity.Inventory;
import com.SYNTIARO_POS_SYSTEM.Entity.Invoice;
import com.SYNTIARO_POS_SYSTEM.Repository.InvoiceRepo;
import com.SYNTIARO_POS_SYSTEM.Response.InvoiceWrapper;
import com.SYNTIARO_POS_SYSTEM.Service.InventoryService;
import com.SYNTIARO_POS_SYSTEM.Service.InvoiceService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
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

import javax.persistence.EntityNotFoundException;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(path = "/sys/VendorInvoice")
public class InvoiceControllerIMPL implements InvoiceController {

    @Autowired
    InvoiceService invoiceService;

    @Autowired
    InvoiceRepo invoiceRepo;

    // THIS METHOD IS USE FOR POST INVOICE
    @Override
    public String saveInvoice(Invoice invoice) {
        return invoiceService.addInvoice(invoice);
    }

    // THIS METHOD IS USE FOR UPDATE INVOICE
    @Override
    public Invoice updateinvoice(Invoice invoice) {
        return this.invoiceService.updateInvoice(invoice);
    }

    // THIS METHOD IS USE FOR GET ALL LIST OF INVOICE
    @Override
    public List<Invoice> getInvoice() {
        return this.invoiceService.getInvoice();
    }

    // THIS METHOD IS USE FOR UPDATE INVOICE
    @Override
    public ResponseEntity<Invoice> updateInvoice(@PathVariable("invoice_id") Integer invoice_id, @RequestBody Invoice invoice) {
        try {
            Invoice updateInvoice = invoiceService.updateInvoice(invoice_id, invoice);
            if (updateInvoice != null) {
                return new ResponseEntity<>(updateInvoice, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // THIS METHOD IS USE FOR FETCH INVOICE BY STOREID
    @GetMapping("/invoices/{storeId}")
    public List<Invoice> getInvoicesByStoreId(@PathVariable Integer storeId) {
        return invoiceService.fetchInvoicesByStoreId(storeId);
    }

    // THIS METHOD IS USE FOR FETCH INVOICE BY ID
    @GetMapping("/getInvoiceByID/{id}")
    public ResponseEntity<?> fetchDetailsById(@PathVariable Integer id) {
        Optional<Invoice> optionalInvoice = invoiceRepo.findById(id);
        if (optionalInvoice.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Invoice with ID " + id + " not found");
        }
        return ResponseEntity.ok(optionalInvoice.get());
    }

    // THIS METHOD IS USE FOR DELETE INVOICE
    @DeleteMapping("/{invoiceId}")
    public ResponseEntity<String> deleteInvoice(@PathVariable Integer invoiceId) {
        try {
            invoiceService.deleteInvoiceById(invoiceId);
            return ResponseEntity.ok("Invoice with ID " + invoiceId + " deleted");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping("/excelinvoice/{storeId}")
    public ResponseEntity<byte[]> generateExcelByStoreId(@PathVariable Integer storeId ) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Invoice Data");
            Row headerRow = sheet.createRow(0);
            String[] headerss = { "invoice Id", "Vendor Name", "invoice Date", "payment_status", "item_name",
                    "Quantity", "Unit", "Total", "Store ID" };
            for (int i = 0; i < headerss.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headerss[i]);
            }
            List<Invoice> Lists = invoiceRepo.findByStore_id(storeId);
            int rowNum = 1;
            for (Invoice List : Lists) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(List.getInvoice_id());
                row.createCell(1).setCellValue(List.getVendor_name());
                row.createCell(2).setCellValue(List.getInvoice_date());
                row.createCell(3).setCellValue(List.getPayment_status());
                row.createCell(4).setCellValue(List.getItem_name());
                row.createCell(5).setCellValue(List.getQuantity());
                row.createCell(6).setCellValue(List.getUnit());
                row.createCell(7).setCellValue(List.getTotal());
                row.createCell(8).setCellValue(List.getStore_id());
            }
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "Invoice_data.xlsx");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(outputStream.toByteArray());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    //----------------             FOR GENRATE EXCEL BY DATE FILTER        --------------

    @PostMapping("/excelinvoicedate/")
    public ResponseEntity<byte[]> generateExcelByStoreId(
            @RequestParam Integer store_id,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String endDate) {

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Invoice Data");
            Row headerRow = sheet.createRow(0);
            String[] headers = { "invoice Id", "Vendor Name", "Inventory Code","Item Name","Quantity","Price", "Unit", "Discount",
                     "Total" };
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Modify your query to filter by date range
            List<Invoice> invoices = invoiceRepo.findByStoreIdAndDateRange(store_id, startDate, endDate);

            int rowNum = 1;
            for (Invoice invoice : invoices) {
                Row row = sheet.createRow(rowNum++);
               row.createCell(0).setCellValue(invoice.getInvoice_id());
                row.createCell(1).setCellValue(invoice.getVendor_name());
                row.createCell(2).setCellValue(invoice.getInventory_code());
               row.createCell(3).setCellValue(invoice.getItem_name());
                row.createCell(4).setCellValue(invoice.getQuantity());
                row.createCell(5).setCellValue(invoice.getPrice());
                row.createCell(6).setCellValue(invoice.getUnit());
                row.createCell(7).setCellValue(invoice.getDiscount());
                row.createCell(8).setCellValue(invoice.getTotal());
            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            HttpHeaders headerss = new HttpHeaders();
            headerss.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headerss.setContentDispositionFormData("attachment", "Invoice_data.xlsx");
            return ResponseEntity.ok()
                    .headers(headerss)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(outputStream.toByteArray());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/generate-pdf-invoice/")
    public ResponseEntity<?> generatePDF(
            @RequestParam Integer store_id,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String endDate) throws DocumentException {
        List<Invoice> invoiceList;
        Date startDates = null;
        Date endDates = null;

        if (store_id != null) {
            // Fetch payments for a specific store ID
            invoiceList = invoiceRepo.findByStoreIdAndDateRange(store_id , startDate , endDate);

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
            invoiceList = invoiceRepo.findByStoreIdAndDateRange(store_id , startDate , endDate);
        } else {
            // If no date range is specified, retrieve all stores
            invoiceList = invoiceRepo.findAll();
        }

        if (invoiceList.isEmpty()) {
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



        PdfPTable table = new PdfPTable(9); // Number of columns
        table.setWidthPercentage(100);

        PdfPCell cell = new PdfPCell(new Phrase("Invoice No", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
         cell = new PdfPCell(new Phrase("Vendor Name", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Inventory code", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Item Name", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Quantity", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Price", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Unit", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Discount(%)", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Total", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        ;
        for (Invoice invoice : invoiceList) {
            table.addCell(String.valueOf(invoice.getInvoice_id()));
            table.addCell(String.valueOf(invoice.getVendor_name()));
            table.addCell(invoice.getInventory_code());
            table.addCell(invoice.getItem_name());
            table.addCell(invoice.getQuantity());
            table.addCell(invoice.getPrice());
            table.addCell(invoice.getUnit());
            table.addCell(invoice.getDiscount());
            table.addCell(invoice.getTotal());

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
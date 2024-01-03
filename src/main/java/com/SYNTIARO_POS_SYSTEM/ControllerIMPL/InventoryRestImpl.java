package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Controller.InventoryRest;
import com.SYNTIARO_POS_SYSTEM.Entity.Inventory;
import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import com.SYNTIARO_POS_SYSTEM.Entity.Vendor;
import com.SYNTIARO_POS_SYSTEM.Repository.InventoryRepo;
import com.SYNTIARO_POS_SYSTEM.Repository.StoreRepository;
import com.SYNTIARO_POS_SYSTEM.Service.InventoryService;
import com.SYNTIARO_POS_SYSTEM.ServiceIMPL.InventoryServiceIMPL;
import com.SYNTIARO_POS_SYSTEM.security.services.EmailSenderService;
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
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(path = "/sys/Inventory")
public class InventoryRestImpl implements InventoryRest {
    @Autowired
    InventoryService inventoryService;
    @Autowired
    InventoryRepo inventoryRepo;
    @Autowired
    InventoryServiceIMPL inventoryServiceIMPL;

    @Autowired
    EmailSenderService emailSenderService;

    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    StoreRepository storeRepository;
    private Object inventoryservice;

    @Override
    public List<Inventory> getinvo() {
        return inventoryService.getinvo();
    }

    @Override
    public Inventory updateInventory(Inventory inventory) {
        return this.inventoryService.updateInventory(inventory);
    }

    @Override
    public ResponseEntity<HttpStatus> deleteinventory(String id) {
        try {
            int inventoryId = Integer.parseInt(id);
            if (!inventoryService.existsInventory(inventoryId)) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND); // Return 404 if inventory does not exist
            }
            this.inventoryService.deleteinventory(inventoryId);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (NumberFormatException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // Return 400 for invalid id format
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // THIS METHOD IS USE FOR FETCH INVENTORY BY ID
    @Override
    public Inventory fetchDetailsById(int id) {
        return inventoryService.getInventoryDetailsById(id);
    }

    // THIS METHOD IS USE FOR UPDATE INVENTORY
    @Override
    public ResponseEntity<Inventory> updateInventory(@PathVariable("id") String id, @RequestBody Inventory inventory) {
        try {
            Inventory updateInventory = inventoryService.updateInventory(id, inventory);
            if (updateInventory != null) {
                return new ResponseEntity<>(updateInventory, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // THIS METHOD IS USE FOR FETCH INVENTORY BY STOREID BY SHRADHA
    @GetMapping("/inventory/{storeId}")
    public ResponseEntity<List<Inventory>> getInventoryByStoreId(@PathVariable String storeId) {
        try {
            List<Inventory> inventory = inventoryService.fetchInventoryByStoreId(storeId);
            if (inventory.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(inventory, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<String> addInventoryItem(@RequestBody Inventory newItem) {
        try {
            // ----ADDED NEW CODE-----BY RUSHIKESH-----
            Integer lastBillNumber = inventoryRepo.findLastNumberForStore(newItem.getStoreid());
            newItem.setId(lastBillNumber != null ? lastBillNumber + 1 : 1);
            Inventory addedItem = inventoryServiceIMPL.addInventoryItem(newItem);
            return ResponseEntity.ok("Item added successfully with ID: " + addedItem.getId());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GENRATE EXCEL FILE BY STOREID .
    @Override
    public ResponseEntity<byte[]> generateExcelByStoreId(Integer store_id) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Inventory Data");
            Row headerRow = sheet.createRow(0);
            String[] headerss = {"Name", "Quantity", "Unit", "inventory_date", "category Name", "inventory_code No",
                    "price", "Expirydate ", "Minlevel", "Minlevelunit "};
            for (int i = 0; i < headerss.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headerss[i]);
            }
            List<Inventory> Lists = inventoryRepo.findByStoreid(String.valueOf(store_id) );
            int rowNum = 1;
            for (Inventory List : Lists) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(List.getName());
                row.createCell(1).setCellValue(List.getQuantity());
                row.createCell(2).setCellValue(List.getUnit());
                row.createCell(3).setCellValue(List.getInventorydate());
                row.createCell(4).setCellValue(List.getCategory());
                row.createCell(5).setCellValue(List.getInventory_code());
                row.createCell(6).setCellValue(List.getPrice());
                row.createCell(7).setCellValue(List.getExpirydate());
                row.createCell(8).setCellValue(List.getMinlevel());
                row.createCell(9).setCellValue(List.getMinlevelunit());
            }
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "Inventory_data.xlsx");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(outputStream.toByteArray());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/minilevel/{storeId}")
    public ResponseEntity<List<String>> getMinileve(@PathVariable String storeId) {
       // List<Store> stores = storeRepository.findAll();
        List<String> productsBelowMinLevel = new ArrayList<>();


            List<Inventory> productsInStore = inventoryRepo.findByStoreid(storeId);
            System.out.println(productsInStore);
            for (Inventory product : productsInStore) {
                if (product.getQuantity() < product.getMinlevel()) {
                    productsBelowMinLevel.add("* You Have Crossed Minimum level of " + product.getName() +" current Product Level is " +""+ product.getQuantity() + " "+product.getUnit()+"  ."+" Please Update Your Inventory "+" ");
                }
            }


        if (productsBelowMinLevel.isEmpty()) {
            return ResponseEntity.ok(Collections.singletonList(""));
        } else {
            return ResponseEntity.ok(productsBelowMinLevel);
        }

    }

    private void sendEmailToVendor(List<String> productsBelowMinLevel, Store store) {
        SimpleMailMessage message = new SimpleMailMessage();
        // Set the sender's email
        // message.setFrom("your-email@gmail.com");
        message.setTo(store.getEmail());
        message.setSubject("Products Below Minimum Level");
        message.setText("The following products are below their minimum levels:\n\n" + String.join("\n", productsBelowMinLevel));

        javaMailSender.send(message);
    }



    @PostMapping("/excelInventory/")
    public ResponseEntity<byte[]> generateExcelByStoreIdWithDateRange(
            @RequestParam String storeid,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String endDate) {

        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Inventory Data");
            Row headerRow = sheet.createRow(0);

            String[] headers = {
                    "Inventory Id", "Product Name", "Issued Date", "Product Code", "Quantity",
                    "Unit", "Category", "Price", "Expiry Date"
            };

            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Replace this with your actual data retrieval logic
            List<Inventory> inventorysList = inventoryRepo.findByStoreIdAndDateRange(storeid, startDate, endDate);
            int rowNum = 1;

            for (Inventory inventory : inventorysList) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(inventory.getId());
                row.createCell(1).setCellValue(inventory.getName());
                row.createCell(2).setCellValue(inventory.getCreateddate());
                row.createCell(3).setCellValue(inventory.getInventory_code());
                row.createCell(4).setCellValue(inventory.getQuantity());
                row.createCell(5).setCellValue(inventory.getUnit());
                row.createCell(6).setCellValue(inventory.getCategory());
                row.createCell(7).setCellValue(inventory.getPrice());
                row.createCell(8).setCellValue(inventory.getExpirydate());

            }

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            HttpHeaders headerss = new HttpHeaders();
            headerss.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headerss.setContentDispositionFormData("attachment", "Inventory_data.xlsx");

            return ResponseEntity.ok()
                    .headers(headerss)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(outputStream.toByteArray());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PostMapping("/generate-pdf-inventory/")
    public ResponseEntity<?> generatePDF(
            @RequestParam String storeid,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") String endDate) throws DocumentException {
        List<Inventory> inventoryList;
        Date startDates = null;
        Date endDates = null;

        if (storeid != null && !storeid.isEmpty()) {
            // Fetch payments for a specific store ID
            inventoryList = inventoryRepo.findByStoreIdAndCreatedDateBetween(storeid , startDate , endDate);

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
            inventoryList = inventoryRepo.findByStoreIdAndCreatedDateBetween(storeid, startDate, endDate);
        } else {
            // If no date range is specified, retrieve all stores
            inventoryList = inventoryRepo.findAll();
        }

        if (inventoryList.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, byteArrayOutputStream);

        document.open();

        Paragraph title = new Paragraph("INVENTORY DETAILS" , new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD));
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);// Add spacing between title and table


        Paragraph spacing = new Paragraph(" "); // Empty paragraph
        spacing.setSpacingAfter(10f); // Adjust the spacing as needed
        document.add(spacing);



        PdfPTable table = new PdfPTable(9); // Number of columns
        table.setWidthPercentage(100);

        PdfPCell cell = new PdfPCell(new Phrase("Sr.No", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Product Name", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("issued Date", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Product Code", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Quantity", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Unit", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Category", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Price ₹", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        cell = new PdfPCell(new Phrase("Expiry Date", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
        table.addCell(cell);
        ;

        for (Inventory inventory : inventoryList) {
            table.addCell(String.valueOf(inventory.getId()));
            table.addCell(inventory.getName());
            table.addCell(inventory.getCreateddate());
            table.addCell(inventory.getInventory_code());
            table.addCell(String.valueOf(inventory.getQuantity()));
            table.addCell(inventory.getUnit());
            table.addCell(inventory.getCategory());
            table.addCell(String.valueOf(inventory.getPrice()));
            table.addCell(String.valueOf(inventory.getExpirydate()));


        }

        document.add(table);

        document.close();

        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Inventory-details.pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(byteArrayInputStream));
    }

}
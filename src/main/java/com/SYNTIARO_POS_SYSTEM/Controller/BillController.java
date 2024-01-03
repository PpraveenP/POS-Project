package com.SYNTIARO_POS_SYSTEM.Controller;

import com.SYNTIARO_POS_SYSTEM.Entity.Bill;
import com.SYNTIARO_POS_SYSTEM.Request.BillRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping(path = "/sys/Bill")
public interface BillController {
     @PostMapping(path = "/postbillOrder")
    public ResponseEntity<String> placebill(@RequestBody BillRequest request);
    @PutMapping(path = "/updatebill") // For Update Data
    public Bill updateBill(@RequestBody Bill bill);
    @DeleteMapping(path = "/deletebill/{id}") // For Delete Data
    public ResponseEntity<HttpStatus> deletebill(@PathVariable String id);
    @GetMapping(path = "/bill/{id}")
    public Optional<Bill> getbillbyid(@PathVariable Integer id);
    @PostMapping(path = "/postBill") // For Add Data
    public int saveBill(@RequestBody Bill bill);
    @GetMapping(path = "/getbill")
    public List<Bill> getBill();
    @GetMapping(path = "/getBillByID/{id}")
    public ResponseEntity<?> getBillById(@PathVariable Integer id);
    @PatchMapping(path = "/updateBillorder/{id}") // its use for
    public ResponseEntity<String> updateBill(
            @PathVariable("id") Integer id,
            @RequestBody Bill bill);
    @PatchMapping(path = "/patchbillOrder")
    public Bill patchbill(@RequestBody BillRequest request);
    @PostMapping("/ExcelBill/{store_id}")
    public ResponseEntity<byte[]> generateExcelByStoreId(@PathVariable Integer store_id);

}

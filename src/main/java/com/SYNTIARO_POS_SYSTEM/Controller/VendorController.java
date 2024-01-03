package com.SYNTIARO_POS_SYSTEM.Controller;

import com.SYNTIARO_POS_SYSTEM.Entity.Vendor;

import com.SYNTIARO_POS_SYSTEM.Response.VendorWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/sys/Vendor")
public interface VendorController {

    @PostMapping(path = "/save")
    public String saveVendor(@RequestBody Vendor vendor);

    @GetMapping(path = "/allVendor")
    public List<Vendor> getVendor();

    @PutMapping(path = "/updatevendor")
    public Vendor updatevendor(@RequestBody Vendor vendor);

    @DeleteMapping(path = "/deletes/{Serial_no}")
    public ResponseEntity<HttpStatus> deleteVendor(@PathVariable Long Serial_no);

    @PatchMapping(path = "/updatevendor/{vendor_id}")
    public ResponseEntity<Vendor> updateVendors(
            @PathVariable("vendor_id") Integer vendor_id,
            @RequestBody Vendor vendor);

    @PostMapping("/getvendorlist/{store_id}")
    public ResponseEntity<byte[]> generateExcelByStoreId(@PathVariable Integer store_id);
}
package com.SYNTIARO_POS_SYSTEM.Controller;

import com.SYNTIARO_POS_SYSTEM.Entity.Inventory;
import com.SYNTIARO_POS_SYSTEM.Response.InventoryWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(path = "/sys/Inventory")
public interface InventoryRest {
    @PostMapping("/save")
    public ResponseEntity<String> addInventoryItem(@RequestBody Inventory newItem);

    @GetMapping(path = "/gets")
    public List<Inventory> getinvo();
    @PutMapping(path = "/updates/{id}")
    public Inventory updateInventory(@RequestBody Inventory inventory);
    @DeleteMapping(path = "/deleteinventory/{id}")
    public ResponseEntity<HttpStatus> deleteinventory(@PathVariable String id);
    @GetMapping("/getInventoryByID/{id}")
    public Inventory fetchDetailsById(@PathVariable int id);
    @PatchMapping(path = "/updateinventory/{id}")
    public ResponseEntity<Inventory> updateInventory(@PathVariable String id,
            @RequestBody Inventory inventory);
    @PostMapping("/generateExcel/{store_id}")
     ResponseEntity<byte[]> generateExcelByStoreId(@PathVariable Integer store_id );



}

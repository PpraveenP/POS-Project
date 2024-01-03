package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import com.SYNTIARO_POS_SYSTEM.Entity.Tax;
import com.SYNTIARO_POS_SYSTEM.Repository.StoreRepository;
import com.SYNTIARO_POS_SYSTEM.Repository.TaxRepo;
import com.SYNTIARO_POS_SYSTEM.Request.StoreRequest;
import com.SYNTIARO_POS_SYSTEM.Service.Taxservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RequestMapping(path = "/sys/Tax")
@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class TaxControllerIMPL {

    @Autowired
    TaxRepo taxRepo;

    @Autowired
    StoreRepository storeRepository;

    @Autowired
    Taxservice taxservice;

    // //THIS METHOD IS USE FOR POST TAX
    @PostMapping("/save")
    public ResponseEntity<Tax> createTax(@RequestBody Tax tax) {
        // Check if the store_id exists in the database
        Optional<Store> store = storeRepository.findById(Long.valueOf(tax.getStoreid_fk()));

        if (store.isPresent()) {
            // ------------------ THIS CODE EDIT BY RUSHIKESH ---------------------
            Long lastBillNumber = taxRepo.findLastNumberForStore(tax.getStoreid_fk());
            tax.setTaxid(lastBillNumber != null ? lastBillNumber + 1 : 1);
            Tax createdTax = taxRepo.save(tax);
            return ResponseEntity.ok(createdTax);
        } else {
            // Store not found, return a 404 Not Found response
            return ResponseEntity.notFound().build();
        }
    }

    // second method update tax use this for update tax ...
    @PatchMapping("/update/{taxId}")
    public ResponseEntity<Tax> updateTax(@PathVariable Long taxId, @RequestBody Tax updatedTax) {
        // Check if the tax with the given ID exists in the database
        Optional<Tax> existingTax = taxRepo.findById(taxId);

        if (existingTax.isPresent()) {
            Tax taxToUpdate = existingTax.get();

            if (updatedTax.getRate() != null) {
                taxToUpdate.setRate(updatedTax.getRate());
            }
            if(updatedTax.getName() != null){
                taxToUpdate.setName(updatedTax.getName());
            }
            Tax updatedTaxEntity = taxRepo.save(taxToUpdate);

            return ResponseEntity.ok(updatedTaxEntity);
        } else {
            // Tax not found, return a 404 Not Found response
            return ResponseEntity.notFound().build();
        }
    }



    // THIS METHOD IS USE FOR GET ALL TAX WITH STORE
    @GetMapping("/stores")
    public ResponseEntity<List<Store>> getAllStoresWithTax() {
        List<Store> stores = storeRepository.findAllStoresWithTax();
        return ResponseEntity.ok(stores);
    }

    @GetMapping("/gettaxbyid/{taxid}")
    public Optional<Tax> getid(@PathVariable Long taxid) {
        return taxRepo.findById(taxid);
    }

    // THIS METHOD IS USE FOR DELETE TAX WITH STORE
    @DeleteMapping("/taxes/{taxId}")
    public ResponseEntity<String> deleteTax(@PathVariable Long taxId) {
        // Delete the tax entry
        taxRepo.deleteById(taxId);
        return ResponseEntity.ok("Tax deleted successfully.");
    }

    // THIS METHOD IS USE FOR GET TAXES BY STORE ID
    @GetMapping("/stores/{storeId}/taxes")
    public ResponseEntity<List<Tax>> getTaxesByStoreId(@PathVariable Long storeId) {
        Optional<Store> storeOptional = storeRepository.findById(storeId);

        if (storeOptional.isPresent()) {
            Store store = storeOptional.get();
            List<Tax> taxes = store.getTax();
            return ResponseEntity.ok(taxes);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}





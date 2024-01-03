package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;



import com.SYNTIARO_POS_SYSTEM.Entity.Inventory;
import com.SYNTIARO_POS_SYSTEM.Repository.InventoryRepo;
import com.SYNTIARO_POS_SYSTEM.Response.InventoryWrapper;
import com.SYNTIARO_POS_SYSTEM.Service.InventoryService;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class InventoryServiceIMPL implements InventoryService {
    @Autowired
    private InventoryRepo inventoryRepo;

    @Override
    public Inventory updateInventory(Inventory inventory) {
        inventoryRepo.save(inventory);
        return inventory;
    }

    //THIS METHOD IS USE FOR DELETE INVENTORY
    @Override
    public void deleteinventory(int inventoryId) {
        inventoryRepo.deleteById(inventoryId);
    }

    //THIS METHOD IS USE FOR GET ALL LIST OF INVENTORY
    @Override
    public List<Inventory> getinvo() {
        return inventoryRepo.findAll();
    }

    // THIS METHOD IS USE FOR FETCH INVENTORY BY STOREID
    @Override
    public Inventory getInventoryDetailsById(int id) {
        return inventoryRepo.findById((int) id).orElse(null);
    }

    // THIS METHOD IS USE FOR FETCH INVENTORY BY STOREID
    @Override
    public List<Inventory> fetchInventoryByStoreId(String storeId) {
        return inventoryRepo.findByStoreid(storeId);
    }

    // THIS METHOD IS USE FOR UPDATE INVENTORY
    @Override
    public Inventory updateInventory(String id, Inventory inventory) {
        Optional<Inventory> existingInventory = inventoryRepo.findById(Integer.parseInt(id));
        if (existingInventory.isPresent()) {
            Inventory updatedInventory = existingInventory.get();
            // Update the properties of the updatedInventory
            if (inventory.getQuantity() != null) {
                updatedInventory.setQuantity(inventory.getQuantity());
            }
            if (inventory.getName() != null) {
                updatedInventory.setName(inventory.getName());
            }
            if (inventory.getInventorydate() != null) {
                updatedInventory.setInventorydate(inventory.getInventorydate());
            }
            if (inventory.getCategory() != null) {
                updatedInventory.setCategory(inventory.getCategory());
            }
            if (inventory.getPrice() != null) {
                updatedInventory.setPrice(inventory.getPrice());
            }
            if (inventory.getExpirydate() != null) {
                updatedInventory.setExpirydate(inventory.getExpirydate());
            }
            if (inventory.getMinlevel() != null) {
                updatedInventory.setMinlevel(inventory.getMinlevel());
            }
            if (inventory.getMinlevelunit() != null) {
                updatedInventory.setMinlevelunit(inventory.getMinlevelunit());
            }
            if (inventory.getUpdatedate() != null) {
                updatedInventory.setUpdatedate(inventory.getUpdatedate());
            }
            if (inventory.getCreateddate() != null) {
                updatedInventory.setCreateddate(inventory.getCreateddate());
            }
            if (inventory.getCreatedby() != null) {
                updatedInventory.setCreatedby(inventory.getCreatedby());
            }
            if (inventory.getUpdatedby() != null) {
                updatedInventory.setUpdatedby(inventory.getUpdatedby());
            }
            if (inventory.getStoreid() != null) {
                updatedInventory.setStoreid(inventory.getStoreid());
            }
            if (inventory.getUnit() != null) {
                updatedInventory.setUnit(inventory.getUnit());
            }
            if (inventory.getGstno() != null) {
                updatedInventory.setGstno(inventory.getGstno());
            }
            if (inventory.getInventory_code() != null) {
                updatedInventory.setInventory_code(inventory.getInventory_code());
            }
            if (inventory.getTotal() != null) {
                updatedInventory.setTotal(inventory.getTotal());
            }

            inventoryRepo.save(updatedInventory);
            return updatedInventory;
        } else {
            return null;
        }
    }

    @Override
    public Inventory addInventoryItem(Inventory newItem) {
        // Check if an item with the same name already exists for the given store ID
        Inventory existingItem = inventoryRepo.findByStoreIdAndName(newItem.getStoreid(), newItem.getName());
        if (existingItem != null) {
            throw new IllegalArgumentException("An item with the same name already exists for this store.");
        }
        return inventoryRepo.save(newItem);
    }

    @Override
    public List<Inventory> fetchInventoryByStoreId(Integer storeId) {
        return inventoryRepo.findByStoreid(String.valueOf(storeId));
    }

    @Override
    public boolean existsInventory(int inventoryId) {
        return inventoryRepo.existsById(inventoryId);
    }






}

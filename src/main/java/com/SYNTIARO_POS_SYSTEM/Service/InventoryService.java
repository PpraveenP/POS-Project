package com.SYNTIARO_POS_SYSTEM.Service;




import com.SYNTIARO_POS_SYSTEM.Entity.Inventory;
import com.SYNTIARO_POS_SYSTEM.Response.InventoryWrapper;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface InventoryService {
    public Inventory addInventoryItem(Inventory newItem);

    Inventory updateInventory(Inventory inventory);


    List<Inventory> getinvo();


    // THIS METHOD IS USE FOR FETCH INVENTORY BY STOREID
    Inventory getInventoryDetailsById(int id);


    // THIS METHOD IS USE FOR UPDATE INVENTORY
    Inventory updateInventory(String id, Inventory inventory);


    // THIS METHOD IS USE FOR FETCH INVENTORY BY STOREID
    List<Inventory> fetchInventoryByStoreId(String storeId);

    // THIS METHOD IS USE FOR FETCH INVENTORY BY STOREID
    List<Inventory> fetchInventoryByStoreId(Integer storeId);


    boolean existsInventory(int inventoryId);

    void deleteinventory(int inventoryId);
}

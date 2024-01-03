package com.SYNTIARO_POS_SYSTEM.Response;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class InventoryWrapper {

    private int inventoryid;
    private Date inventorydate;
    private String inventoryquantity;
    private String inventoryproductname;
    private String inventorycategory;
    private Integer inventoryprice;
    private Date inventory_expirydate;
}

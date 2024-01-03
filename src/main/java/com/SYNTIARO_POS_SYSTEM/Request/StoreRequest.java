package com.SYNTIARO_POS_SYSTEM.Request;

import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import com.SYNTIARO_POS_SYSTEM.Entity.StorePayment;
import com.SYNTIARO_POS_SYSTEM.Entity.Tax;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StoreRequest {


    private Store store;
    private List<Tax> taxes;
    private List <StorePayment> storePayment;

}

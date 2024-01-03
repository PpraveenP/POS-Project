package com.SYNTIARO_POS_SYSTEM.Service;


import com.SYNTIARO_POS_SYSTEM.Entity.Bill;
import com.SYNTIARO_POS_SYSTEM.Response.BillResponse;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface BillService {


 List<Bill> getBill();
 int addBill(Bill bill);
 Bill updateBill(Bill bill);
 void deletebill(int id);

 // THIS METHOD IS USE FOR FETCH BILL BY ID
 Optional<Bill> getbillbyid(Integer id);


 // THIS METHOD IS USE FOR FETCH BILL BY STOREID
 List<Bill> getBillsByStoreId(Integer storeId);


 Bill findBillById(Integer id);

 Bill saveBill(Bill existingBill);

 Bill updateBill(Integer id, Bill bill);


 //THIS METHOD IS USE FOR CALCULATE TOTAL CASH BY STOREID
 Float calculateTotalCashAmountByStoreIdAndDay(Integer storeId, LocalDate specificDay);


 //THIS METHOD IS USE FOR CALCULATE TOTAL UPI BY STOREID
 Float calculateTotalUpiAmountByStoreIdAndDay(Integer storeId, LocalDate specificDay);


 //THIS METHOD IS USE FOR CALCULATE TOTAL CARD BY STOREID
 Float calculateTotalCardAmountByStoreIdAndDay(Integer storeId, LocalDate specificDay);


 //THIS METHOD IS USE FOR ADD AMOUNT IN CLOSING BALANCE FROM BILL
 public void completeOrderAndPlaceBill(Bill bill, LocalDate calculationDate);


}





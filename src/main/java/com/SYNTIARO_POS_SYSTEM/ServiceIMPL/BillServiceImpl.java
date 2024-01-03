package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;



import com.SYNTIARO_POS_SYSTEM.Entity.Balance;
import com.SYNTIARO_POS_SYSTEM.Entity.Bill;
import com.SYNTIARO_POS_SYSTEM.Repository.BalanceRepository;
import com.SYNTIARO_POS_SYSTEM.Repository.BillRepo;
import com.SYNTIARO_POS_SYSTEM.Response.BillResponse;
import com.SYNTIARO_POS_SYSTEM.Service.BillService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Pageable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class  BillServiceImpl implements BillService {
    @Autowired
    BillRepo billRepo;

    @Autowired
    BalanceRepository balanceRepository;

    //THIS METHOD IS USE FOR GET ALL LIST OF BILL
    @Override
    public List<Bill> getBill() {
        return billRepo.findAll();
    }

    //THIS METHOD IS USE FOR ADD BILL
    @Override
    public int addBill(Bill bill) {
        billRepo.save(bill);
        return bill.getId();
    }

    //THIS METHOD IS USE FOR UPDATE BILL
    @Override
    public Bill updateBill(Bill bill) {
        billRepo.save(bill);
        return bill;
    }


    //THIS METHOD IS USE FOR DELETE BILL
    @Override
    public void deletebill(int parseInt) {
        Bill entity = billRepo.getOne(parseInt);
        billRepo.delete(entity);
    }


    // THIS METHOD IS USE FOR FETCH BILL BY STOREID
    @Override
    public List<Bill> getBillsByStoreId(Integer storeId) {
        return billRepo.findBySid(storeId);
    }

    @Override
    public Bill findBillById(Integer id) {
        return billRepo.findById(id).orElse(null);
    }

    @Override
    public Bill saveBill(Bill existingBill) {
        return billRepo.save(existingBill);
    }



    // THIS METHOD IS USE FOR FETCH BILL BY ID
    @Override
    public Optional<Bill> getbillbyid(Integer id) {
        return billRepo.findById(id);
    }


    @Override
    public Bill updateBill(Integer id, Bill bill) {
        Optional<Bill> existingBill = billRepo.findById((int) Integer.parseInt(String.valueOf((id))));
        if (existingBill.isPresent()) {
            Bill updatebill = existingBill.get();

            if (bill.getContact() != null) {
                updatebill.setContact(bill.getContact());
            }

            if (bill.getUpbyname() != null) {
                updatebill.setUpbyname(bill.getUpbyname());
            }
            if (bill.getCrtbyname() != null) {
                updatebill.setCrtbyname(bill.getCrtbyname());
            }
            if (bill.getPaymentmode() != null) {
                updatebill.setPaymentmode(bill.getPaymentmode());
            }
            if (bill.getTranid() != null) {
                updatebill.setTranid(bill.getTranid());
            }
            if (bill.getGst() != null) {
                updatebill.setGst(bill.getGst());
            }
            if (bill.getTotal() != null) {
                updatebill.setTotal(bill.getTotal());
            }
            if (bill.getStore_id() != null) {
                updatebill.setStore_id(bill.getStore_id());
            }
            if (bill.getOrder() != null) {
                updatebill.setOrder(bill.getOrder());
            }
            if (bill.getDiscount() != null) {
                updatebill.setDiscount(bill.getDiscount());
            }
            if(bill.getBilldate() != null){
                updatebill.setBilldate(LocalDate.now());
            }

            billRepo.save(updatebill);
            return updatebill;
        } else {
            return null;
        }
    }


    //THIS METHOD IS USE FOR CALCULATE TOTAL CASH BY STOREID
    public Float calculateTotalCashAmountByStoreIdAndDay(Integer storeId, LocalDate day) {
        // Convert LocalDate to Date
        Date utilDate = java.sql.Date.valueOf(day); // Convert LocalDate to java.util.Date
        Float totalCashAmount = billRepo.calculateTotalCashAmountByStoreIdAndDay(storeId, utilDate);
        return totalCashAmount != null ? totalCashAmount : 0.0f;
    }


    //THIS METHOD IS USE FOR CALCULATE TOTAL UPI BY STOREID
    public Float calculateTotalUpiAmountByStoreIdAndDay(Integer storeId, LocalDate day) {
        Date utilDate = java.sql.Date.valueOf(day); // Convert LocalDate to java.util.Date
        Float totalUpiAmount = billRepo.calculateTotalUpiAmountByStoreIdAndDay(storeId, utilDate);
        return totalUpiAmount != null ? totalUpiAmount : 0.0f;
    }


    //THIS METHOD IS USE FOR CALCULATE TOTAL CARD BY STOREID
    public Float calculateTotalCardAmountByStoreIdAndDay(Integer storeId, LocalDate day) {
        Date utilDate = java.sql.Date.valueOf(day); // Convert LocalDate to java.util.Date
        Float totalCardAmount = billRepo.calculateTotalCardAmountByStoreIdAndDay(storeId, utilDate);
        return totalCardAmount != null ? totalCardAmount : 0.0f;
    }


    @Override
    public void completeOrderAndPlaceBill(Bill bill, LocalDate calculationDate) {
        // Logic to mark order as completed and place the bill

        // Check if the payment method is "cash"
        if (bill.getPaymentmode().equalsIgnoreCase("cash")) {
            // Calculate bill amount
            Double billAmount = Double.valueOf(bill.getTotal());

            if (billAmount == null) {
                billAmount = 0.0; // You can choose a suitable default value
            }

            Balance balance = balanceRepository.findByStoreIdAndDate(bill.getStore_id(), calculationDate);

            if (balance == null) {
                balance = new Balance();
                balance.setStore_id(bill.getStore_id());
                balance.setDate(calculationDate);
                balance.setTodays_opening_Balance(0.0);
                balance.setRemaining_Balance(billAmount);
            } else {
                Double currentBalance = balance.getRemaining_Balance();

                // Update closing balance by adding bill amount
                Double updatedBalance = currentBalance + billAmount;
                balance.setRemaining_Balance(updatedBalance);
                //new code added

            }

            // Save the balance in the database (create new or update existing)
            balanceRepository.save(balance);

            // Now you can display the updated closing balance
            System.out.println("Updated Closing Balance for Store " + balance.getStore_id() + " on " + calculationDate + ": " + balance.getRemaining_Balance());
        } else {
            System.out.println("Payment method is not 'cash', skipping balance update.");
        }
    }





}
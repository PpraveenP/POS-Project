package com.SYNTIARO_POS_SYSTEM.Service;



import com.SYNTIARO_POS_SYSTEM.Entity.Bill;
import com.SYNTIARO_POS_SYSTEM.Entity.OrderFood;
import com.SYNTIARO_POS_SYSTEM.Entity.Orders;
import com.SYNTIARO_POS_SYSTEM.Response.OrderResponse;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Orders> getorder();
    int addOrder(Orders order);
    Orders updateOrder(Orders order);
    void deleteorder(int i);

    Optional<Orders> getorderbyid(Integer orderid);

    // fetch by storeid
    List<Orders> getOrdersByStoreId(String storeId);

    public Orders placeOrders(OrderFood orderFood);





}

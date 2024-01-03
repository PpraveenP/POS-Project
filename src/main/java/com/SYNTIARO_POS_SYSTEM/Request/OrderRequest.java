package com.SYNTIARO_POS_SYSTEM.Request;


import com.SYNTIARO_POS_SYSTEM.Entity.Food;
import com.SYNTIARO_POS_SYSTEM.Entity.OrderFood;
import com.SYNTIARO_POS_SYSTEM.Entity.Orders;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class OrderRequest {

    // USE FOR ORDER AND FOOD MAPPING
    private Orders order;
    private OrderFood orderFood;

    public Orders getOrder() {
        return order;
    }

    public void setOrder(Orders order) {
        this.order = order;
    }

    public OrderFood getOrderFood() {
        return orderFood;
    }

    public void setOrderFood(OrderFood orderFood) {
        this.orderFood = orderFood;
    }
}

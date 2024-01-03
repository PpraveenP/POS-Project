package com.SYNTIARO_POS_SYSTEM.Service;

import com.SYNTIARO_POS_SYSTEM.Entity.OrderFood;

import java.util.List;

public interface OrderFoodService {
	String addFood(OrderFood orderFood);
	List<OrderFood> getFood();

	public OrderFood updateFood(OrderFood orderFood);

	public void deletefood(int parseInt);

	// THIS METHOD IS USE FOR FETCH ORDERFOOD BY STOREID
	List<OrderFood> getOrderFoodByStoreId(String storeId);


}

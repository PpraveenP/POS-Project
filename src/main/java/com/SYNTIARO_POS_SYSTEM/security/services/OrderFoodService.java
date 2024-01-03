package com.SYNTIARO_POS_SYSTEM.security.services;

import com.SYNTIARO_POS_SYSTEM.Entity.OrderFood;

import java.util.List;

public interface OrderFoodService {
	String addFood(OrderFood orderFood);

	List<OrderFood> getFood();

	public OrderFood updateFood(OrderFood orderFood);

	public void deletefood(int parseInt);



}

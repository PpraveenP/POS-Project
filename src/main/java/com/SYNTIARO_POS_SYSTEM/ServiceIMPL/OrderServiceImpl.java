package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.*;
import com.SYNTIARO_POS_SYSTEM.Repository.FoodItemRepository;
import com.SYNTIARO_POS_SYSTEM.Repository.InventoryRepo;
import com.SYNTIARO_POS_SYSTEM.Repository.OrderRepo;
import com.SYNTIARO_POS_SYSTEM.Response.OrderResponse;
import com.SYNTIARO_POS_SYSTEM.Service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    OrderRepo orderRepo;

    @Autowired
    InventoryRepo inventoryRepository;
    @Autowired
    FoodItemRepository foodItemRepository;


    //THIS METHOD IS USE FOR ADD ORDER
    @Override
    public int addOrder(Orders order) {
        orderRepo.save(order);
        return order.getOid();
    }

    //THIS METHOD IS USE FOR UPDATE ORDER
    @Override
    public Orders updateOrder(Orders order) {
        orderRepo.save(order);
        return order;
    }

    //THIS METHOD IS USE FOR DELETE ORDER
    @Override
    public void deleteorder(int parseInt) {
        Orders entity = orderRepo.getOne(parseInt);
        orderRepo.delete(entity);
    }
    //THIS METHOD IS USE FOR GET ORDER BY ID
    @Override
    public Optional<Orders> getorderbyid(Integer orderid) {
        return orderRepo.findById(orderid) ;
    }

    public int getorders(Orders orders) {
        orderRepo.save(orders);
        return orders.getOid();
    }

    // THIS METHOD IS USE FOR ORDER LIST
    @Override
    public List<Orders> getorder() {
        return orderRepo.findAll();
    }


   //THIS METHOD IS USE FOR GET ORDER LIST BY STOREID
    @Override
    public List<Orders> getOrdersByStoreId(String storeId) {
        return orderRepo.findBySid(storeId);
    }


    @Override
    public Orders placeOrders(OrderFood orderFood) {
        FoodItem foodItem = foodItemRepository.findByNameAndStoreId(orderFood.getFood_name(), orderFood.getStore_id());

        if (foodItem == null) {

        } else {
            int requestedQuantity = orderFood.getQuantity();
            List<Ingredient> ingredients = foodItem.getIngredients();
            for (Ingredient ingredient : ingredients) {
                Inventory inventory = inventoryRepository.findByStoreIdAndName(ingredient.getStoreid(), ingredient.getName());
                if (inventory != null) {
                    float currentQuantity = inventory.getQuantity();
                    float requiredQuantity = ingredient.getQuantity() * requestedQuantity;
                    float newQuantity = currentQuantity - requiredQuantity;

                    if (newQuantity < 0) {
                        throw new RuntimeException("Insufficient quantity for: " + ingredient.getName());
                    } else {
                        inventory.setQuantity(newQuantity);
                        inventoryRepository.save(inventory);
                    }
                } else {
                    throw new RuntimeException("Inventory item not found: " + ingredient.getName());
                }
            }
        }
        return new Orders(); // Replace this with your response.
    }

}

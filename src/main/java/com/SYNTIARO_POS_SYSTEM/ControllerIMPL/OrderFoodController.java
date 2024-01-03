package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.OrderFood;
import com.SYNTIARO_POS_SYSTEM.Repository.OrderFoodRepo;
import com.SYNTIARO_POS_SYSTEM.Service.OrderFoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(path = "/sys/OrderFood")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderFoodController {

    @Autowired
    private OrderFoodService orderFoodService;

    @Autowired
    private OrderFoodRepo orderFoodRepo;

    // THIS METHOD IS USE FOR GET ALL LIST OF FOOD
    @GetMapping(path = "/getfood")
    public List<OrderFood> getFood(String food) {
        return this.orderFoodService.getFood();

    }

    // THIS METHOD IS USE FOR POST FOOD
    @PostMapping(path = "/postfood")
    public String addFood(@RequestBody OrderFood orderFood) {

        String id = orderFoodService.addFood(orderFood);
        return id;
    }

    @PostMapping(path = "/foodimg")
    public ResponseEntity<OrderFood> createFood(
            @RequestParam("fname") String fname,
            @RequestParam("category") String category,
            @RequestParam("subcategory") String subcategory,
            @RequestParam("store_id") String store_id,
            @RequestParam("price") Integer price,
            @RequestParam("quantity") Integer quantity) {

        OrderFood foods = new OrderFood();
        foods.setFood_name(fname);
        foods.setCategory(category);
        foods.setSubcategory(subcategory);
        foods.setStore_id(store_id);
        foods.setPrice(price);
        foods.setQuantity(quantity);
        OrderFood createdOrderFood = orderFoodRepo.save(foods);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrderFood);
    }

    // THIS METHOD IS USE FOR UPDATE FOOD
    @PutMapping(path = "/updatefood")
    public OrderFood updateFood(@RequestBody OrderFood orderFood, @RequestParam("image") MultipartFile image) {
        return this.orderFoodService.updateFood(orderFood);
    }

    // THIS METHOD IS USE FOR DELETE FOOD
    @DeleteMapping(path = "/food/{foodid}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable String foodid) {
        try {
            this.orderFoodService.deletefood(Integer.parseInt(foodid));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // THIS METHOD IS USE FOR FETCH ORDERFOOD BY STOREID
    @GetMapping("/orderfood/{storeId}")
    public List<OrderFood> getOrderFoodByStoreId(@PathVariable String storeId) {
        return orderFoodService.getOrderFoodByStoreId(storeId);
    }

    // ----------------------RUSHIKESH ADDED THIS NEW CODE --------------
    @GetMapping("/food-quantity/{storeId}")
    public OrderFood getTotalQuantityByFoodName(@PathVariable String storeId) {
        List<Object[]> resultList = orderFoodRepo.getTotalQuantityByFoodName(storeId);

        if (!resultList.isEmpty()) {
            Object[] firstResult = resultList.get(0);
            String foodName = (String) firstResult[0]; // Assuming the first element is the food name
            Long quantity = (Long) firstResult[1]; // Assuming the second element is the quantity
            // Create a custom result object with field names
            OrderFood result = new OrderFood(foodName, Math.toIntExact(quantity));
            return result;
        } else {
            return null; // Return null if there are no results
        }
    }

}


package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.FoodItem;
import com.SYNTIARO_POS_SYSTEM.Repository.FoodItemRepository;
import com.SYNTIARO_POS_SYSTEM.ServiceIMPL.FoodItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/sys/fooditems")
public class FoodItemController {

    private final FoodItemService foodItemService;

    @Autowired
    public FoodItemController(FoodItemService foodItemService) {
        this.foodItemService = foodItemService;
    }

    @Autowired
    private FoodItemRepository foodItemRepository;

    // POST endpoint for creating a new food item
    @PostMapping("/addfood")
    public ResponseEntity<?> createFoodItem(@RequestBody FoodItem foodItem) {
        // Check if the food name is available in the specified store ID
        boolean foodNameExists = foodItemRepository.checkFoodNameExists(foodItem.getStoreid(), foodItem.getName());

        if (foodNameExists) {
            return new ResponseEntity<>("Food name already exists in the specified store", HttpStatus.BAD_REQUEST);
        }
        Long lastBillNumber = foodItemRepository.findLastNumberForStore(foodItem.getStoreid());
        foodItem.setId(lastBillNumber != null ? lastBillNumber + 1 : 1);

        FoodItem createdFoodItem = foodItemRepository.save(foodItem);
        return new ResponseEntity<>(createdFoodItem, HttpStatus.CREATED);
    }

    @GetMapping("/getfood")
    public List<FoodItem> getallfood() {
        return foodItemService.getAllFoodItems();
    }

    // {--------FOR GET FOOD ITEM BY ID -------}
    @GetMapping("/getbyid/{Ser_no}") // WRITE BY RUSHIKESH
    public ResponseEntity<?> getFoodById(@PathVariable Long Ser_no) {
        Optional<FoodItem> foodItem = foodItemService.getFoodItemById(Ser_no);
        if (foodItem != null) {
            return new ResponseEntity<>(foodItem, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getfood/{storeid}")
    public List<FoodItem> getFoodItemsByStoreId(@PathVariable String storeid) {
        return foodItemRepository.getFoodItemsByStoreid(storeid);
    }

    @DeleteMapping("/deletefood/{Ser_no}")
    public ResponseEntity<String> deleteFoodItemById(@PathVariable Long Ser_no) {
        if (foodItemRepository.existsById(Ser_no)) {
            foodItemRepository.deleteById(Ser_no);
            return ResponseEntity.ok("Food item deleted successfully");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // ----for fooditem update
    @PatchMapping("/updatefood/{Ser_no}") // MADE BY RUSHIKESH
    public ResponseEntity<?> updateFoodItem(@PathVariable Long Ser_no, @RequestBody FoodItem updatedFoodItem) {
        Optional<FoodItem> existingFoodItem = foodItemService.getFoodItemById(Ser_no);
        if (!existingFoodItem.isPresent()) {
            return new ResponseEntity<>("Food item not found", HttpStatus.NOT_FOUND);
        }
        FoodItem updatedItem = foodItemService.updateFoodItem(Ser_no, updatedFoodItem);
        return new ResponseEntity<>(updatedItem, HttpStatus.OK);
    }

}

package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.FoodItem;
import com.SYNTIARO_POS_SYSTEM.Entity.Ingredient;
import com.SYNTIARO_POS_SYSTEM.Repository.FoodItemRepository;
import com.SYNTIARO_POS_SYSTEM.Repository.InventoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FoodItemService {

    private FoodItemRepository foodItemRepository;

    @Autowired
    InventoryRepo inventoryRepository;

    @Autowired
    public FoodItemService(FoodItemRepository foodItemRepository) {
        this.foodItemRepository = foodItemRepository;
    }

    // Create a new food item
    public FoodItem createFoodItem(FoodItem foodItem) {


        Long lastBillNumber = foodItemRepository.findLastNumberForStore(foodItem.getStoreid());
        foodItem.setId(lastBillNumber != null ? lastBillNumber + 1 : 1);


        return foodItemRepository.save(foodItem);
    }

    // Read all food items
    public List<FoodItem> getAllFoodItems() {
        return foodItemRepository.findAll();
    }

    // Read a single food item by ID
    public Optional<FoodItem> getFoodItemById(Long id) {
        return foodItemRepository.findById(id);
    }

    // Update an existing food item
    public FoodItem updateFoodItem(Long id, FoodItem foodItem) {
        return foodItemRepository.save(foodItem);
    }

    // Delete a food item by ID
    public void deleteFoodItem(Long id) {
        foodItemRepository.deleteById(id);
    }


    public void reduceIngredientsFromInventorys(Long foodItemId) {
        FoodItem foodItem = foodItemRepository.findById(foodItemId).orElse(null);
        if (foodItem == null) {
            // FoodItem not found, handle error
            return;
        }

        List<Ingredient> ingredients = foodItem.getIngredients();
        for (Ingredient ingredient : ingredients) {

        }
    }

    //// this code multiple foodname and chec the invenotry quntity and show error

    public void reduceIngredientsFromInventoryByFoodName(String foodName) {
        FoodItem foodItem = foodItemRepository.findByName(foodName);
        if (foodItem == null) {
            throw new RuntimeException("Food item not found.");
        }

        List<Ingredient> ingredients = foodItem.getIngredients();
        for (Ingredient ingredient : ingredients) {

        }
    }

    public void reduceIngredientsFromInventory(List<String> foodItemNames) {
        for (String foodItemName : foodItemNames) {
            Optional<FoodItem> optionalFoodItem = Optional.ofNullable(foodItemRepository.findByName(foodItemName));
            if (optionalFoodItem.isPresent()) {
                FoodItem foodItem = optionalFoodItem.get();
                reduceIngredientsLogic(foodItem);
                foodItemRepository.save(foodItem);
                //updateInventoryQuantities(foodItem);
            }
        }
    }

    private void reduceIngredientsLogic(FoodItem foodItem) {
        List<Ingredient> ingredients = foodItem.getIngredients();

        for (Ingredient ingredient : ingredients) {
            reduceIngredientQuantity(ingredient);
        }
    }

    private void reduceIngredientQuantity(Ingredient ingredient) {
        Float currentQuantity = ingredient.getQuantity();
        Float reductionAmount = (float) calculateReductionAmount(ingredient);

        if (currentQuantity >= reductionAmount) {
            ingredient.setQuantity(currentQuantity - reductionAmount);
        } else {
            throw new InsufficientIngredientException("Insufficient quantity of " + ingredient.getName());
        }
    }

    public class InsufficientIngredientException extends RuntimeException {
        public InsufficientIngredientException(String message) {
            super(message);
        }
    }

    private Float calculateReductionAmount(Ingredient ingredient) {
        double reductionPercentage = 0.10; // 10%
        Float currentQuantity = ingredient.getQuantity();
        Float reductionAmount = (float) (currentQuantity * reductionPercentage);

        return reductionAmount;
    }

}


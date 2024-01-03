package com.SYNTIARO_POS_SYSTEM.Response;


import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class FoodWrapper {

    private Integer food_id;

    private String category;

    private String subcategory;

    private String food_name;

    private Integer quantity;

    private String store_id;

    private Byte image;


    public FoodWrapper(Integer food_id, String category, String subcategory, String food_name, Integer quantity, String store_id, Byte image) {
        this.food_id = food_id;
        this.category = category;
        this.subcategory = subcategory;
        this.food_name = food_name;
        this.quantity = quantity;
        this.store_id = store_id;
        this.image = image;
    }
}


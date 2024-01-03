package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.util.List;


//@NamedQuery(name="OrderFood.getOrderFood",query="select new com.SYNTIARO_POS_SYSTEM.Wrapper.FoodWrapper (f.food_id,f.category,f.subcategory,f.food_name,f.quantity,f.store_id,f.image) from com.SYNTIARO_POS_SYSTEM.Entity.OrderFood f")
@Entity
@Data
//@DynamicUpdate
//@DynamicInsert
//@AllArgsConstructor
@NoArgsConstructor
@Table(name="orderfood")

public class OrderFood {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Serial_no ;

    @Column(name="food_id", length = 45)
    private int food_id;

    @Column(name="food_name", length = 255)
    private String food_name;

    @Column(name="category", length = 255)
    private String category;

    @Column(name="subcategory", length = 255)
    private String subcategory;

    @Column(name="store_id", length = 255)
    private String store_id;

    @Column(name="quantity")
    private int quantity;

    @Column(name="price")
    private int price;

    public OrderFood(String foodName, int quantity) {
        this.food_name=foodName;
        this.quantity=quantity;
    }


    public int getFood_id() {
        return food_id;
    }

    public void setFood_id(int food_id) {
        this.food_id = food_id;
    }

    public String getFood_name() {
        return food_name;
    }

    public void setFood_name(String food_name) {
        this.food_name = food_name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }

    public String getStore_id() {
        return store_id;
    }

    public void setStore_id(String store_id) {
        this.store_id = store_id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getPrice() {
        return price;
    }

    public void setPrice(int price) {
        this.price = price;
    }
}


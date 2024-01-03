package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;


//@NamedQuery(name="Food.getFood",query="select new com.SYNTIARO_POS_SYSTEM.Wrapper.FoodWrapper (f.food_id,f.category,f.subcategory,f.food_name,f.quantity,f.store_id,f.image) from com.SYNTIARO_POS_SYSTEM.Entity.Food f")
@Entity
@Data
@DynamicUpdate
@DynamicInsert
@AllArgsConstructor
@NoArgsConstructor
@Table(name="food")
public class Food {


    // ----ADDED NEW CODE-----BY RUSHIKESH
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Serial_no ;
	


   @Column(name="food_id")
   private Integer food_id;

    @Column(name="food_name", length = 255)
    private String food_name;

   @Column(name="category", length = 255)
   private String category;

   @Column(name="subcategory", length = 255)
   private String subcategory;

   @Column(name="gst_no", length = 255)
   private String gst_no;

   @Column(name="update_date", length = 50)
   private String update_date;

   @Column(name="update_by", length = 50)
   private String update_by;

   @Column(name="created_date")
   private String created_date;

   @Column(name="created_by")
   private String created_by;

   @Column(name="store_id", length = 255)
   private String store_id;

   @Lob
   @Column(name="image")
   private String image;

   @Column(name="description", length = 255)
   private String description;

   @Column(name="price")
   private Integer price;

  @Column(name="foodcode")
  private String foodcode;

    public void setFood_id(Integer food_id) {
        this.food_id = food_id;
    }

    public String getFood_names() {
      // TODO Auto-generated method stub
      return null;
   }
    public Integer getFood_id() {
        return food_id;
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

    public String getGst_no() {
        return gst_no;
    }

    public void setGst_no(String gst_no) {
        this.gst_no = gst_no;
    }



    public String getUpdate_by() {
        return update_by;
    }

    public void setUpdate_by(String update_by) {
        this.update_by = update_by;
    }


    public String getCreated_by() {
        return created_by;
    }

    public void setCreated_by(String created_by) {
        this.created_by = created_by;
    }

    public String getStore_id() {
        return store_id;
    }

    public void setStore_id(String store_id) {
        this.store_id = store_id;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public String getFoodcode() {
        return foodcode;
    }

    public void setFoodcode(String foodcode) {
        this.foodcode = foodcode;
    }

    @PostPersist
    public void generateStoreCode() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
        String formattedDate = dateFormat.format(date);
        this.update_date = formattedDate;
        this.created_date = formattedDate;
    }


}


package com.SYNTIARO_POS_SYSTEM.Entity;

import javax.persistence.*;
import java.io.Serial;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
@Table(name="receipe")
@Entity
public class  FoodItem implements Serializable {

    @Serial
    private static final long serialVersionUID =1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Serial_no")
    private Long Ser_no ;

    // ----ADDED NEW CODE-----BY RUSHIKESH

    private Long id;

    private String name;
    private String storeid;

    private String createdby;

    private String updatedby;

    private String created_date;

    private String updated_date ;



    @OneToMany(targetEntity = Ingredient.class,cascade = CascadeType.ALL)
    @JoinColumn(name = "ingredients_id",referencedColumnName = "Serial_no")
    private List<Ingredient> ingredients;

    public Long getSer_no() {
        return Ser_no;
    }

    public void setSer_no(Long ser_no) {
        Ser_no = ser_no;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public List<Ingredient> getIngredients() {
        return ingredients;
    }

    public void setIngredients(List<Ingredient> ingredients) {
        this.ingredients = ingredients;
    }

    public String getStoreid() {
        return storeid;
    }

    public void setStoreid(String storeid) {
        this.storeid = storeid;
    }

    public String getCreatedby() {
        return createdby;
    }

    public void setCreatedby(String createdby) {
        this.createdby = createdby;
    }

    public String getUpdatedby() {
        return updatedby;
    }

    public void setUpdatedby(String updatedby) {
        this.updatedby = updatedby;
    }

    @PostPersist
    public void generateStoreCode() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
        String formattedDate = dateFormat.format(date);
        this.updated_date = formattedDate;
        this.created_date = formattedDate;
    }
}

package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serial;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Date;
//@NamedQuery(name="Inventory.getAllInventory" , query="select new com.SYNTIARO_POS_SYSTEM.Response.InventoryWrapper(i.id ,i.inventorydate ,i.quantity ,i.productname ,i.category,i.price ,i.expirydate) from  Inventory i")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "inventory")
public class Inventory implements Serializable{


// ----ADDED NEW CODE-----BY RUSHIKESH
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Serial_no ;

    @Column(name = "id")
    private Integer id;

    @Column(name = "quantity")
    private Float quantity;


    @Column(name = "name")
    private String name;

    @Column(name ="inventory_date")
    private Date inventorydate = new Date();

    @Column(name = "category")
    private String category;

    @Column(name = "price")
    private Integer price;

    @Column(name = "expirydate")
    private LocalDate expirydate;

    @Column(name = "minlevel")
    private Integer minlevel;

    @Column(name = "minlevelunit")
    private String minlevelunit;

    @Column(name = "updatedate")
    private String updatedate ;

    @Column(name = "createddate")
    private String createddate ;

    @Column(name = "createdby")
    private String createdby;

    @Column(name = "updatedby")
    private String updatedby;

    @Column(name = "storeid")
    private String storeid;

    @Column(name = "unit")
    private String unit;

    @Column(name = "total")
    private Long total;

    @Column(name="gstno")
    private String gstno;

    @Column(name="inventory_code")
    private String inventory_code;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Float getQuantity() {
        return quantity;
    }

    public void setQuantity(Float quantity) {
        this.quantity = quantity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getInventorydate() {
        return inventorydate;
    }

    public void setInventorydate(Date inventorydate) {
        this.inventorydate = inventorydate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public LocalDate getExpirydate() {
        return expirydate;
    }

    public void setExpirydate(LocalDate expirydate) {
        this.expirydate = expirydate;
    }

    public Integer getMinlevel() {
        return minlevel;
    }

    public void setMinlevel(Integer minlevel) {
        this.minlevel = minlevel;
    }

    public String getMinlevelunit() {
        return minlevelunit;
    }

    public void setMinlevelunit(String minlevelunit) {
        this.minlevelunit = minlevelunit;
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

    public String getStoreid() {
        return storeid;
    }

    public void setStoreid(String storeid) {
        this.storeid = storeid;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public String getGstno() {
        return gstno;
    }

    public void setGstno(String gstno) {
        this.gstno = gstno;
    }

    public String getInventory_code() {
        return inventory_code;
    }

    public void setInventory_code(String inventory_code) {
        this.inventory_code = inventory_code;
    }

    @PostPersist
    public void generateStoreCode() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
        String formattedDate = dateFormat.format(date);
        SimpleDateFormat dateFormats = new SimpleDateFormat("yyyy-MM-dd");
        String formattedDates = dateFormats.format(date);
        this.updatedate = formattedDate;
        this.createddate = formattedDates;
    }
}








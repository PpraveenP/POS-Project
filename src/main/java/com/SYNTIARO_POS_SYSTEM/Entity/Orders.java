package com.SYNTIARO_POS_SYSTEM.Entity;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.Collection;
import java.util.Date;
import java.util.List;


//@NamedQuery(name="Orders.getAllList", query = ("select new com.SYNTIARO_POS_SYSTEM.Response.OrderResponse (o.id,o.orddate,o.tblno,o.ordstatus) from com.SYNTIARO_POS_SYSTEM.Entity.Orders o"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "Orders")
public class Orders implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer Serial_no ;

    @Column(name = "Order_Id")
    private int oid;

    @Column(name = "Order_Date")
    private LocalDate orddate = LocalDate.now();
//    private String orddate ;


    @Column(name = "tblno")
    private String tblno;

    @Column(name = "Order_Status")
    private String ordstatus;

    @Column(name = "ordertype")
    private String ordertype;

    @Column(name = "Create_Date")
    private String crtdate ;

    @Column(name = "Update_Date")
    private String upddate ;

    @Column(name = "Create_By_Name")
    private String crtby;

    @Column(name = "Update_by_Name")
    private String updby;

    @Column(name = "Store_Id")
    private String sid;


    @OneToMany(targetEntity = OrderFood.class,cascade = CascadeType.ALL)
    @JoinColumn(name = "order_idfk",referencedColumnName = "Serial_no")
    private List<OrderFood> orderFoods;



    public int getOid() {
        return oid;
    }




    public void setOid(int oid) {
        this.oid = oid;
    }

    public LocalDate getOrddate() {
        return orddate;
    }

    public void setOrddate(LocalDate orddate) {
        this.orddate = orddate;
    }

    public String getTblno() {
        return tblno;
    }

    public void setTblno(String tblno) {
        this.tblno = tblno;
    }

    public String getOrdstatus() {
        return ordstatus;
    }

    public void setOrdstatus(String ordstatus) {
        this.ordstatus = ordstatus;
    }

    public String getOrdertype() {
        return ordertype;
    }

    public void setOrdertype(String ordertype) {
        this.ordertype = ordertype;
    }

    public String getCrtdate() {
        return crtdate;
    }

    public void setCrtdate(String crtdate) {
        this.crtdate = crtdate;
    }

    public String getUpddate() {
        return upddate;
    }

    public void setUpddate(String upddate) {
        this.upddate = upddate;
    }

    public String getCrtby() {
        return crtby;
    }

    public void setCrtby(String crtby) {
        this.crtby = crtby;
    }

    public String getUpdby() {
        return updby;
    }

    public void setUpdby(String updby) {
        this.updby = updby;
    }

    public String getSid() {
        return sid;
    }

    public void setSid(String sid) {
        this.sid = sid;
    }

    public List<OrderFood> getOrderFoods() {
        return orderFoods;
    }

    public void setOrderFoods(List<OrderFood> orderFoods) {
        this.orderFoods = orderFoods;
    }


    public void setQuantity(int requestedQuantity) {
    }

    public void setOrderDate(LocalDate calculationDate) {
    }

    @PostPersist
    public void generateStoreCode() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
        String formattedDate = dateFormat.format(date);
        this.upddate = formattedDate;
        this.crtdate = formattedDate;
       // this.orddate = formattedDate;
    }
}

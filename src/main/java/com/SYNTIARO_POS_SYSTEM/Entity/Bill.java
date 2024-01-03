package com.SYNTIARO_POS_SYSTEM.Entity;


import lombok.*;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.GenerationTime;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.io.Serial;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;


//@NamedQuery(name="Bill.getAllBill", query = ("select new com.SYNTIARO_POS_SYSTEM.Response.BillResponse (b.id,b.billdate,b.paymentmode,b.email,b.contact,b.tranid, b.total , o.orddate ,o.tblno, o.ordstatus ,o.oid) from com.SYNTIARO_POS_SYSTEM.Entity.Bill b JOIN b.order o"))

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name = "Bill")
public class Bill implements Serializable {  // ALL TABEL AND FILED MENTION
    // ----ADDED NEW CODE-----BY RUSHIKESH
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
   // @Column(name = "Serial_no"
    private Integer Serial_no ;
    // @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Bill_No")
    private Integer id;
    @Column(name="Bill_date")
    private LocalDate billdate = LocalDate.now();
    // @Size(max = 10, min = 10)
    @Column(name ="contact")
    private String contact;
    @Column(name ="update_Date")
    private String update ;
    @Column(name ="crtdate")
    private String crtdate ;
    @Column(name ="upbyname")
    private String upbyname;
    @Column(name ="crtbyname")
    private String crtbyname;
    @Column(name="payment_mode")
    private String paymentmode;
    @Column(name="transaction_id")
    private String tranid;
    @Column(name = "gst")
    private String gst;
    @Column(name = "discount")
    private Integer discount;
    @Column(name="total")
    private Float total;
    @Column(name="store_id")
    private Integer store_id;


    // FOR ORDER AND BILL TABEL JOIN
    @OneToMany(targetEntity = Orders.class,cascade = CascadeType.ALL)
    @JoinColumn(name = "Bill_no_fk",referencedColumnName = "Serial_no")
    private List<Orders> order;


    public Bill(LocalDate date, Float totalBalance, String paymentMode , Integer store_id) {
        this.billdate = date;
        this.total = totalBalance;
        this.paymentmode = paymentMode;
        this.store_id=store_id;
    }
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public LocalDate getBilldate() {return billdate;}

    public void setBilldate(LocalDate billdate) {this.billdate = billdate;}

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }


    public String getUpbyname() {
        return upbyname;
    }

    public void setUpbyname(String upbyname) {
        this.upbyname = upbyname;
    }

    public String getCrtbyname() {
        return crtbyname;
    }

    public void setCrtbyname(String crtbyname) {
        this.crtbyname = crtbyname;
    }

    public String getPaymentmode() {
        return paymentmode;
    }

    public void setPaymentmode(String paymentmode) {
        this.paymentmode = paymentmode;
    }

    public String getTranid() {
        return tranid;
    }

    public void setTranid(String tranid) {
        this.tranid = tranid;
    }

    public String getGst() {
        return gst;
    }

    public void setGst(String gst) {
        this.gst = gst;
    }

    public Float getTotal() {
        return total;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

    public Integer getStore_id() {
        return store_id;
    }

    public void setStore_id(Integer store_id) {
        this.store_id = store_id;
    }

    public List<Orders> getOrder() {
        return order;
    }

    public void setOrder(List<Orders> order) {
        this.order = order;
    }

    public Integer getDiscount() {
        return discount;
    }

    public void setDiscount(Integer discount) {
        this.discount = discount;
    }

    @PostPersist
    public void generateStoreCode() {
        Date date = new Date();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
        String formattedDate = dateFormat.format(date);
        this.update = formattedDate;
        this.crtdate = formattedDate;
    }
}

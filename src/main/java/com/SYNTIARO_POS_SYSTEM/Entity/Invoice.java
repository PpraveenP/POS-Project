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
import java.util.Date;

//@NamedQuery(name="Invoice.getAllInvoice", query = "Select new com.SYNTIARO_POS_SYSTEM.Response.InvoiceWrapper(i.store_id, i.invoice_id,  i.item_name, i.invoice_date,   i.price, i.Quantity, i.discount, i.invoice_status, i.payment_Status) from Invoice i")
@Entity
@Table(name = "vendor_inventory")
@Data
@DynamicInsert
@DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
public class Invoice implements Serializable{


	@Serial
	private static final long SerialVersion =1L;
	// ----ADDED NEW CODE-----BY RUSHIKESH
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer Serial_no ;

	@Column(name = "invoice_id")
	private Integer invoice_id;

	@Column(name = "store_id", length = 255)
	private Integer store_id;

	@Column(name = "vendor_name")
	private String vendor_name;

	@Column(name = "item_name")
	private String item_name;

	@Column(name = "invoice_date")
	private Date invoice_date = new Date();

	@Column(name = "price")
	private String price;

	@Column(name = "quantity")
	private String quantity;

	@Column(name = "discount")
	private String discount;


	@Column(name = "payment_status")
	private String payment_status;

	@Column(name = "total")
	private String total;

	@Column(name = "gstno")
	private String gstno;

	@Column(name = "createby")
	private String createby;

	@Column(name = "updtaeby")
	private String updateby;

	@Column(name = "create_date")
	private String create_date ;

	@Column(name = "update_date")
	private String update_date ;

	@Column(name = "inventory_code")
	private String inventory_code;

	@Column(name = "unit")
	private String unit;


	public Integer getInvoice_id() {
		return invoice_id;
	}

	public void setInvoice_id(Integer invoice_id) {
		this.invoice_id = invoice_id;
	}

	public Integer getStore_id() {
		return store_id;
	}

	public void setStore_id(Integer store_id) {
		this.store_id = store_id;
	}

	public String getVendor_name() {
		return vendor_name;
	}

	public void setVendor_name(String vendor_name) {
		this.vendor_name = vendor_name;
	}

	public String getItem_name() {
		return item_name;
	}

	public void setItem_name(String item_name) {
		this.item_name = item_name;
	}

	public Date getInvoice_date() {
		return invoice_date;
	}

	public void setInvoice_date(Date invoice_date) {
		this.invoice_date = invoice_date;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}

	public String getQuantity() {
		return quantity;
	}

	public void setQuantity(String quantity) {
		this.quantity = quantity;
	}

	public String getDiscount() {
		return discount;
	}

	public void setDiscount(String discount) {
		this.discount = discount;
	}


	public String getPayment_status() {
		return payment_status;
	}

	public void setPayment_status(String payment_status) {
		this.payment_status = payment_status;
	}

	public String getTotal() {
		return total;
	}

	public void setTotal(String total) {
		this.total = total;
	}

	public String getGstno() {
		return gstno;
	}

	public void setGstno(String gstno) {
		this.gstno = gstno;
	}

	public String getCreateby() {
		return createby;
	}

	public void setCreateby(String createby) {
		this.createby = createby;
	}

	public String getUpdateby() {
		return updateby;
	}

	public void setUpdateby(String updateby) {
		this.updateby = updateby;
	}

	public String getCreate_date() {
		return create_date;
	}

	public void setCreate_date(String create_date) {
		this.create_date = create_date;
	}

	public String getUpdate_date() {
		return update_date;
	}

	public void setUpdate_date(String update_date) {
		this.update_date = update_date;
	}

	public String getInventory_code() {
		return inventory_code;
	}

	public void setInventory_code(String inventory_code) {
		this.inventory_code = inventory_code;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@PostPersist
	public void generateStoreCode() {
		Date date = new Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
		String formattedDate = dateFormat.format(date);
		SimpleDateFormat dateFormats = new SimpleDateFormat("yyyy-MM-dd");
		String formattedDates = dateFormats.format(date);
		this.update_date = formattedDate;
		this.create_date = formattedDates;
	}
}
	


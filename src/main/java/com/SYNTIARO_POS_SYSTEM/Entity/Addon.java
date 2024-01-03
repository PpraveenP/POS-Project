package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Date;

//@NamedQuery(name="Addon.getAddon",query="select new com.SYNTIARO_POS_SYSTEM.Response.AddonWrapper(a.itemid,a.itemname,a.quantity,a.price,a.storeid)from Addon a")

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
@DynamicUpdate
@DynamicInsert
@Entity
@Table(name = "addon")
public class Addon {

	@Id
	@Column(name = "item_id", length = 45)
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int itemid;
	@Column(name = "item_name", length = 255)
	private String itemname;
	@Column(name = "GST_no", length = 255)
	private String gstno;

	@Column(name = "price", length = 255)
	private String price;

	@Column(name = "update_date", length = 50)
	private String updatedate ;

	@Column(name = "Update_by", length = 50)
	private String updateby;

	@Column(name = "created_date")
	private String createddate ;

	@Column(name = "created_by")
	private String createdby;

	@Column(name = "store_id", length = 255)
	private String storeid;

	@Column(name = "quantity")
	private Integer quantity;

	@Column(name = "addoncode")
	private String addoncode;

	public int getId() {
		// TODO Auto-generated method stub
		return 0;
	}

	public int getItemid() {
		return itemid;
	}

	public void setItemid(int itemid) {
		this.itemid = itemid;
	}

	public String getItemname() {
		return itemname;
	}

	public void setItemname(String itemname) {
		this.itemname = itemname;
	}

	public String getGstno() {
		return gstno;
	}

	public void setGstno(String gstno) {
		this.gstno = gstno;
	}

	public String getPrice() {
		return price;
	}

	public void setPrice(String price) {
		this.price = price;
	}



	public String getUpdateby() {
		return updateby;
	}

	public void setUpdateby(String updateby) {
		this.updateby = updateby;
	}


	public String getCreatedby() {
		return createdby;
	}

	public void setCreatedby(String createdby) {
		this.createdby = createdby;
	}

	public String getStoreid() {
		return storeid;
	}

	public void setStoreid(String storeid) {
		this.storeid = storeid;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public String getAddoncode() {
		return addoncode;
	}

	public void setAddoncode(String addoncode) {
		this.addoncode = addoncode;
	}

	@PostPersist
	public void generateStoreCode() {
		Date date = new Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
		String formattedDate = dateFormat.format(date);
		this.updatedate = formattedDate;
		this.createddate = formattedDate;
	}

}

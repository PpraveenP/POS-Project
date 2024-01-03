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
import java.util.List;

//@NamedQuery(name = "Payment.getAllPayment",query = "Select new com.SYNTIARO_POS_SYSTEM.Response.PaymentWrapper(p.payment_id, p.store_id, p.vendor_name, p.payment_date, p.payment_mode, p.due_date, v.vendor_address, v.mobile_no, v.bank_name, v.Branch, v.account_no, v.IFSC_code, v.UPI_id)from Payment p JOIN p.vendor v")
@Entity
@Table(name = "Payment")
@Data
@DynamicInsert
@DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
public class Payment implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer Serial_no ;


	@Column(name = "Payment_id", length = 45)
	private Integer payment_id;

	@Column(name = "store_id", length = 255)
	private Integer store_id;

	@Column(name = "Vendor_name")
	private String vendor_name;

	@Column(name = "payment_date")
	private String payment_date;

	@Column(name = "gst")
	private String gst;


	@Column(name = "payment_mode")
	private String payment_mode;

	@Column(name = "due_date")
	private LocalDate due_date;

	@Column(name="bank_name")
	private String bank_name;

	@Column(name="branch")
	private String branch;

	@Column(name="account_no")
	private Long account_no;

	@Column(name="ifsc_code")
	private String ifsc_code;

	@Column(name="upi_id")
	private String upi_id;

	@Column(name = "total")
	private String total;

	@Column(name = "creatby")
	private String creatby;

	@Column(name = "updateby")
	private String updateby;

	@Column(name = "create_date")
	private String create_date ;

	@Column(name = "update_date")
	private String update_date ;

	@Column(name = "payment_status")
	private String payment_status;


	@OneToMany(targetEntity = Vendor.class, cascade = CascadeType.ALL )
	@JoinColumn(name = "payment_id_fk", referencedColumnName = "payment_id")
	private List<Vendor>vendor;

	public Integer getPayment_id() {
		return payment_id;
	}

	public void setPayment_id(Integer payment_id) {
		this.payment_id = payment_id;
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

	public String getPayment_date() {
		return payment_date;
	}

	public void setPayment_date(String payment_date) {
		this.payment_date = payment_date;
	}

	public String getGst() {
		return gst;
	}

	public void setGst(String gst) {
		this.gst = gst;
	}

	public String getPayment_mode() {
		return payment_mode;
	}

	public void setPayment_mode(String payment_mode) {
		this.payment_mode = payment_mode;
	}

	public LocalDate getDue_date() {
		return due_date;
	}

	public void setDue_date(LocalDate due_date) {
		this.due_date = due_date;
	}

	public String getBank_name() {
		return bank_name;
	}

	public void setBank_name(String bank_name) {
		this.bank_name = bank_name;
	}

	public String getBranch() {
		return branch;
	}

	public void setBranch(String branch) {
		this.branch = branch;
	}

	public Long getAccount_no() {
		return account_no;
	}

	public void setAccount_no(Long account_no) {
		this.account_no = account_no;
	}

	public String getIfsc_code() {
		return ifsc_code;
	}

	public void setIfsc_code(String ifsc_code) {
		this.ifsc_code = ifsc_code;
	}

	public String getUpi_id() {
		return upi_id;
	}

	public void setUpi_id(String upi_id) {
		this.upi_id = upi_id;
	}

	public String getTotal() {
		return total;
	}

	public void setTotal(String total) {
		this.total = total;
	}

	public String getCreatby() {
		return creatby;
	}

	public void setCreatby(String creatby) {
		this.creatby = creatby;
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

	public List<Vendor> getVendor() {
		return vendor;
	}

	public void setVendor(List<Vendor> vendor) {
		this.vendor = vendor;
	}

	@PostPersist
	public void generateStoreCode() {
		Date date = new Date();
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss a");
		String formattedDate = dateFormat.format(date);
		this.payment_date = formattedDate;
		this.update_date = formattedDate;
		this.create_date =formattedDate;
	}


}
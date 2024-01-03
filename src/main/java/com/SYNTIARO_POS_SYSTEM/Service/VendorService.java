package com.SYNTIARO_POS_SYSTEM.Service;

import com.SYNTIARO_POS_SYSTEM.Entity.Vendor;

import com.SYNTIARO_POS_SYSTEM.Response.VendorWrapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public interface VendorService {


   //THIS METHOD IS USE FOR GET ALL LIST OF VENDOR
	List<Vendor> getVendors();

   //THIS METHOD IS USE FOR UPDATE VENDOR
	Vendor updateVendor(Vendor vendor);

	//THIS METHOD IS USE FOR ADD VENDOR
	String addVendor(Vendor vendor);
	// THIS METHOD IS USE FOR FETCH VENDOR BY ID
	Vendor getVendorDetailsById(Integer id);
	//THIS METHOD IS USE FOR POST VEDOR
	Vendor saveDetails(Vendor vendor);
	// THIS METHOD IS USE FOR UPDATE VENDOR
	Vendor updateVendor(Integer vendor_id, Vendor updatevendor);
	// THIS METHOD IS USE FOR FETCH VENDOR BY STOREID
	List<Vendor> fetchVendorsBystoreId(Integer storeId);
}
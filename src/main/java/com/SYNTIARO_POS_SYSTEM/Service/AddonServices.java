package com.SYNTIARO_POS_SYSTEM.Service;


import com.SYNTIARO_POS_SYSTEM.Entity.Addon;
import com.SYNTIARO_POS_SYSTEM.Response.AddonWrapper;
import org.springframework.http.ResponseEntity;

import java.util.List;


public interface AddonServices {

	int saveaddon(Addon Addon);

	List<Addon> getAddOn();

	Addon updateAddon(Addon fAddon);

	void deleteaddon(int itemid);

	// THIS METHOD IS USE FOR FETCH ADDON BY ID
	Addon getAddonDetailsById(Integer itemid);


	// THIS METHOD IS USE FOR UPDATE ADDON
	Addon updateAddon(Integer itemid, Addon updateaddon);


	// THIS METHOD IS USE FOR FETCH ADDON BY STOREID
	List<Addon> getAddonsByStoreId(String storeId);

}

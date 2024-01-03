package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;



import com.SYNTIARO_POS_SYSTEM.Entity.Addon;
import com.SYNTIARO_POS_SYSTEM.Repository.AddonRepo;
import com.SYNTIARO_POS_SYSTEM.Response.AddonWrapper;
import com.SYNTIARO_POS_SYSTEM.Service.AddonServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class AddonServiceIMPL implements AddonServices {

	@Autowired
	private AddonRepo addonRepo;



   //THIS METHOD IS USE FOR POST ADDON
	@Override
	public int saveaddon(Addon foodAddon) {
		// TODO Auto-generated method stub
		addonRepo.save(foodAddon);

		return foodAddon.getId();
	}

	//THIS METHOD IS USE FOR GET ALL LIST OF ADDON
	@Override
	public List<Addon> getAddOn() {
		return addonRepo.findAll();
	}

	//THIS METHOD IS USE FOR UPDATE ADDON
	@Override
	public Addon updateAddon(Addon Addon) {
		addonRepo.save(Addon);
		return Addon;
	}

	//THIS METHOD IS USE FOR DELETE ADDON
	@Override
	public void deleteaddon(int i) {
		Addon entity = addonRepo.getOne(i);
		addonRepo.delete(entity);

	}

	// THIS METHOD IS USE FOR FETCH ADDON BY ID
	@Override
	public Addon getAddonDetailsById(Integer itemid) {
		return addonRepo.findById((int) itemid).orElse(null);
	}


	// THIS METHOD IS USE FOR FETCH ADDON BY STOREID
	@Override
	public List<Addon> getAddonsByStoreId(String storeId) {
		return addonRepo.findByStoreid(storeId);
	}


	// THIS METHOD IS USE FOR UPDATE ADDON
	@Override
	public Addon updateAddon(Integer itemid, Addon Addon) {
		Optional<Addon> existingAddon = addonRepo.findById((int) Integer.parseInt(String.valueOf((itemid))));
		if (existingAddon.isPresent()) {
			Addon updateaddon = existingAddon.get();

			// Update specific fields if provided in the request
//
			if (Addon.getItemname() != null) {
				updateaddon.setItemname(Addon.getItemname());
			}
			if (Addon.getGstno() != null) {
				updateaddon.setGstno(Addon.getGstno());
			}
			if (Addon.getPrice() != null) {
				updateaddon.setPrice(Addon.getPrice());
			}
			if (Addon.getUpdatedate() != null) {
				updateaddon.setUpdatedate(Addon.getUpdatedate());
			}
			if (Addon.getUpdateby() != null) {
				updateaddon.setUpdateby(Addon.getUpdateby());
			}
			if (Addon.getCreateddate() != null) {
				updateaddon.setCreateddate(Addon.getCreateddate());
			}
			if (Addon.getCreatedby() != null) {
				updateaddon.setCreatedby(Addon.getCreatedby());
			}
			if (Addon.getStoreid() != null) {
				updateaddon.setStoreid(Addon.getStoreid());
			}
			if (Addon.getQuantity() != null) {
				updateaddon.setQuantity(Addon.getQuantity());
			}
			if (Addon.getAddoncode() != null) {
				updateaddon.setAddoncode(Addon.getAddoncode());
			}
			addonRepo.save(updateaddon);
			return updateaddon;
		} else {
			return null;
		}
	}

}

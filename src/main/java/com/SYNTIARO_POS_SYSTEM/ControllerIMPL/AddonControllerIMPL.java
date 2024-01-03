package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Controller.AddonRest;
import com.SYNTIARO_POS_SYSTEM.Entity.Addon;
import com.SYNTIARO_POS_SYSTEM.Response.AddonWrapper;
import com.SYNTIARO_POS_SYSTEM.Service.AddonServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class AddonControllerIMPL implements AddonRest {

	@Autowired
	AddonServices addonServices;
	@Override
	public int saveaddon(@RequestBody Addon Addon) {
		int id = addonServices.saveaddon(Addon);
		return id;

	}
	@Override
	public List<Addon> getAddon() {
		return addonServices.getAddOn();
	}

	@Override
	public Addon updateAddon(@RequestBody Addon Addon) {
		return this.addonServices.updateAddon(Addon);
	}

	@Override
	public ResponseEntity<HttpStatus> deleteUser(@PathVariable String itemid) {
		try {
			this.addonServices.deleteaddon(Integer.parseInt(itemid));
			return new ResponseEntity<>(HttpStatus.OK);
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Override
	public Addon fetchDetailsById(Integer itemid) {
		return addonServices.getAddonDetailsById(itemid);

	}
	@Override
	public ResponseEntity<Addon> updateAddon(@PathVariable("itemid") Integer itemid, @RequestBody Addon Addon) {
		try {
			Addon updateFoodAddon = addonServices.updateAddon(itemid, Addon);
			if (updateFoodAddon != null) {
				return new ResponseEntity<>(updateFoodAddon, HttpStatus.OK);
			} else {
				return new ResponseEntity<>(HttpStatus.NOT_FOUND);
			}
		} catch (Exception e) {
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	@GetMapping("/addon/{storeId}")
	public List<Addon> getAddonsByStoreId(@PathVariable String storeId) {
		return addonServices.getAddonsByStoreId(storeId);
	}

}

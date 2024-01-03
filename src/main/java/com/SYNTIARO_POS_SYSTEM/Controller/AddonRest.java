package com.SYNTIARO_POS_SYSTEM.Controller;

import com.SYNTIARO_POS_SYSTEM.Entity.Addon;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(path = "/sys/Addons")
public interface AddonRest {
        @PostMapping(path = "/saveaddon")
        public int saveaddon(@RequestBody Addon addon);
        @GetMapping(path = "/allAddon")
        public List<Addon> getAddon();
        @PutMapping(path = "/updateaddon")
        public Addon updateAddon(@RequestBody Addon addon);
        @DeleteMapping(path = "/addon/{itemid}")
        public ResponseEntity<HttpStatus> deleteUser(@PathVariable String itemid);
        @GetMapping("/getAddonByID/{itemid}")
        public Addon fetchDetailsById(@PathVariable Integer itemid);
        @PatchMapping(path = "/updateaddon/{itemid}")
        public ResponseEntity<Addon> updateAddon(
                        @PathVariable("itemid") Integer itemid,
                        @RequestBody Addon foodAddon);

}

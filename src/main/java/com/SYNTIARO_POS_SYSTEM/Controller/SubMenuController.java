package com.SYNTIARO_POS_SYSTEM.Controller;

import com.SYNTIARO_POS_SYSTEM.Entity.SubMenu;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(path = "/sys/SubMenu")
public interface SubMenuController {

    @PostMapping(path = "/saves")
    public String saveSubMenu(@RequestBody SubMenu subMenu);

    @GetMapping(path = "/allSubMenu")
    public List<SubMenu> getSubMenu();

    @DeleteMapping(path = "/delete/{subMenu_id}")
    public ResponseEntity<HttpStatus> deleteSubMenu(@PathVariable String subMenu_id);

}

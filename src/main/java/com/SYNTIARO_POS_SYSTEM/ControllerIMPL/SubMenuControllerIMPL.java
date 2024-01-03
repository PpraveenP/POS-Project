package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Controller.SubMenuController;
import com.SYNTIARO_POS_SYSTEM.Entity.SubMenu;
import com.SYNTIARO_POS_SYSTEM.Repository.SubMenuRepo;
import com.SYNTIARO_POS_SYSTEM.Service.SubMenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class SubMenuControllerIMPL implements SubMenuController {
    @Autowired
    SubMenuService subMenuService;

    @Autowired
    SubMenuRepo subMenuRepo;

    private int parseInt;

    // THIS METHOD IS USE FOR POST SUBMENU
    @Override
    public String saveSubMenu(SubMenu subMenu) {
        return subMenuService.addSubMenu(subMenu);
    }

    // THIS METHOD IS USE FOR GET ALL LIST OF SUBMENU
    @Override
    public List<SubMenu> getSubMenu() {
        return subMenuService.getSubMenu();
    }

    // THIS METHOD IS USE FOR DELETE SUBMENU
    @Override
    public ResponseEntity<HttpStatus> deleteSubMenu(String subMenu_id) {
        try {
            this.subMenuService.deletesubMenu(Integer.parseInt(subMenu_id));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // THIS METHOD IS USE FOR UPDATE SUBMENU
    @PatchMapping("/patchsubmenu/{id}")
    public ResponseEntity<SubMenu> updateSubMenuFields(
            @PathVariable("id") int id,
            @RequestBody Map<String, String> updatedFields) {
        SubMenu subMenu = subMenuService.getSubMenuById(parseInt);
        // Update fields based on the provided values
        if (updatedFields.containsKey("title")) {
            String updatedTitle = updatedFields.get("title");
            subMenu.setTitle(updatedTitle);
        }
        if (updatedFields.containsKey("path")) {
            String updatedPath = updatedFields.get("path");
            subMenu.setPath(updatedPath);
        }
        SubMenu updatedSubMenu = subMenuService.updatedSubMenu(id, subMenu);
        return new ResponseEntity<>(updatedSubMenu, HttpStatus.OK);
    }
}

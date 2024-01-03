package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Controller.MenuController;
import com.SYNTIARO_POS_SYSTEM.Entity.Menu;
import com.SYNTIARO_POS_SYSTEM.Repository.MenuRepo;
import com.SYNTIARO_POS_SYSTEM.Service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class MenuControllerIMPL implements MenuController {
    @Autowired
    MenuService menuService;

    @Autowired
    MenuRepo menuRepo;
    private Object parseInt;

    // THIS METHOD IS USE POST MENU
    @Override
    public String saveMenu(Menu menu) {
        return menuService.addMenu(menu);
    }

    // THIS METHOD IS USE FOR GET ALL LIST OF MENU
    @Override
    public List<Menu> getMenu() {
        return menuService.getMenu();
    }

    // THIS METHOD IS USE FOR DELETE MENU
    @Override
    public ResponseEntity<HttpStatus> deleteMenu(String menu_id) {
        try {
            this.menuService.deletemenu(Integer.parseInt(menu_id));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    // THIS METHOD IS USE FOR UPDATE MENU
    @PatchMapping("/patchmenu/{id}")
    public ResponseEntity<Menu> updateMenuFields(
            @PathVariable("id") int id,
            @RequestBody Map<String, String> updatedFields) {
        Menu menu = menuService.getMenuById((Integer) parseInt);// getSubMenuById
        // Update fields based on the provided values
        if (updatedFields.containsKey("title")) {
            String updatedTitle = updatedFields.get("title");
            menu.setTitle(updatedTitle);
        }
        if (updatedFields.containsKey("path")) {
            String updatedPath = updatedFields.get("path");
            menu.setPath(updatedPath);
        }
        Menu updatedMenu = menuService.updatedMenu(id, menu);
        return new ResponseEntity<>(updatedMenu, HttpStatus.OK);
    }
}

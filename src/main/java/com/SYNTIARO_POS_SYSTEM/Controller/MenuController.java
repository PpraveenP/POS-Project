package com.SYNTIARO_POS_SYSTEM.Controller;

import com.SYNTIARO_POS_SYSTEM.Entity.Menu;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RequestMapping(path = "/sys/Menu")
public interface MenuController {
    @PostMapping(path = "/saves")
    public String saveMenu(@RequestBody Menu menu);
    @GetMapping(path = "/allMenu")
    public List<Menu> getMenu();
    @DeleteMapping(path = "/delete/{menu_id}")
    public ResponseEntity<HttpStatus> deleteMenu(@PathVariable String menu_id);
}

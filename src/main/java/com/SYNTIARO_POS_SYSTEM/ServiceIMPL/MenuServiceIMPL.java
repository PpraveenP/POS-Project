package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Menu;
import com.SYNTIARO_POS_SYSTEM.Repository.MenuRepo;
import com.SYNTIARO_POS_SYSTEM.Service.MenuService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Slf4j
@Service
public class MenuServiceIMPL implements MenuService {

    @Autowired
    private MenuRepo menuRepo;
    private Long parseInt;

    //THIS METHOD IS USE FOR ADD MENU
    @Override
    public String addMenu(@RequestBody Menu menu) {
        menuRepo.save(menu);
        return menu.getPath();
    }

    //THIS METHOD IS USE FOR GET ALL LIST OF MENY
    @Override
    public List<Menu> getMenu() {
        return menuRepo.findAll();
    }

    //THIS METHOD IS USE FOR DELETE MENU
    @Override
    public void deletemenu(int i) {
        Menu entity = menuRepo.getOne(parseInt);
        menuRepo.delete(entity);
    }

    //THIS METHOD IS USE FOR UPDATE MENU
    @Override
    public Menu updatedMenu(int id, Menu menu) {
        menuRepo.save(menu);
        return menu;
    }

    //THIS METHOD IS USE FOR GET MENU BY ID
    @Override
    public Menu getMenuById(int parseInt) {
        return menuRepo.findById(parseInt);
    }


}

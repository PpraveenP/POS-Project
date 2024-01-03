package com.SYNTIARO_POS_SYSTEM.Service;

import com.SYNTIARO_POS_SYSTEM.Entity.Menu;
import java.util.List;

public interface MenuService  {


    String addMenu(Menu menu);

    List<Menu> getMenu();

    void deletemenu(int i);


    Menu updatedMenu(int id, Menu menu);

    Menu getMenuById(int parseInt);
}



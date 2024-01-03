package com.SYNTIARO_POS_SYSTEM.Service;

import com.SYNTIARO_POS_SYSTEM.Entity.SubMenu;

import java.util.List;

public interface SubMenuService {

    String addSubMenu(SubMenu subMenu);

    List<SubMenu> getSubMenu();

    void deletesubMenu(int i);

    SubMenu getSubMenuById(int parseInt);

    SubMenu updatedSubMenu(int id, SubMenu subMenu);
}

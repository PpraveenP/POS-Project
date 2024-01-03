package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.SubMenu;
import com.SYNTIARO_POS_SYSTEM.Repository.SubMenuRepo;
import com.SYNTIARO_POS_SYSTEM.Service.SubMenuService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Slf4j
@Service
public class SubMenuServiceIMPL implements SubMenuService {
    @Autowired
    private SubMenuRepo subMenuRepo;
    private int parseInt;
    private int id;

    //THIS METHOD IS USE FOR ADD SUBMENU
    @Override
    public String addSubMenu(@RequestBody SubMenu subMenu) {
        subMenuRepo.save(subMenu);
        return subMenu.getTitle();
    }

    //THIS METHOD IS USE FOR GET ALL LIST OF SUBMENU
    @Override
    public List<SubMenu> getSubMenu() {
        return subMenuRepo.findAll();
    }

    //THIS METHOD IS USE FOR DELETE SUBMENU
    @Override
    public void deletesubMenu(int i) {
        SubMenu entity = subMenuRepo.getOne((long) parseInt);
        subMenuRepo.delete(entity);
    }

    //THIS METHOD IS USE FOR GET SUBMENU BY ID
    @Override
    public SubMenu getSubMenuById(int parseInt) {
        return subMenuRepo.findById(parseInt);
    }


    //THIS METHID IS USE FOR UPDATE SUBMENU
    @Override
    public SubMenu updatedSubMenu(int id, SubMenu subMenu) {
        subMenuRepo.save(subMenu);
        return subMenu;
    }

}


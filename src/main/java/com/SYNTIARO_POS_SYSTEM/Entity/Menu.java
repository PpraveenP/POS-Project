package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;
import javax.persistence.*;
import java.util.List;
import javax.persistence.Table;

@Entity
@Table(name = "Menus")
@Data
@DynamicInsert
@DynamicUpdate
@AllArgsConstructor
@NoArgsConstructor
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "menu_id")
    private int id;

    @Column(name = "Title")
    private String Title;

    @Column(name = "Path")
    private String Path;


    @Column(name = "icon")
    private String icon;

    @OneToMany(targetEntity = SubMenu.class, cascade = CascadeType.ALL)
    @JoinColumn(name = "menu_id_fk", referencedColumnName = "menu_id")
    private List<SubMenu> subMenu;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return Title;
    }

    public void setTitle(String title) {
        Title = title;
    }

    public String getPath() {
        return Path;
    }

    public void setPath(String path) {
        Path = path;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public List<SubMenu> getSubMenu() {
        return subMenu;
    }

    public void setSubMenu(List<SubMenu> subMenu) {
        this.subMenu = subMenu;
    }
}


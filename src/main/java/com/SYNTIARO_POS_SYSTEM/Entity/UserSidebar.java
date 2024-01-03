package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

import javax.persistence.*;
import java.awt.*;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@DynamicUpdate
@DynamicInsert
@Table(name = "UserSidebar")
public class UserSidebar {

    @Id
    @Column(name = "user_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "username")
    private String username;

    @Column(name = "StoreId")
    private String store_id;

    @OneToMany (targetEntity = Menu.class, cascade = CascadeType.ALL )
    @JoinColumn(name = "user_id_fk" , referencedColumnName = "user_id")
    private List<Menu> menu;

    public String orElse(Object o) {
        return username;
    }



    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getStore_id() {
        return store_id;
    }

    public void setStore_id(String store_id) {
        this.store_id = store_id;
    }

    public List<Menu> getMenu() {
        return menu;
    }

    public void setMenu(List<Menu> menu) {
        this.menu = menu;
    }
}



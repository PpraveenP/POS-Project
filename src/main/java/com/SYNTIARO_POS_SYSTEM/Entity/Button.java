package com.SYNTIARO_POS_SYSTEM.Entity;

import javax.persistence.*;

@Entity
@Table(name = "Button")
public class Button {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;

    private String butName;
    private String store_id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getButName() {
        return butName;
    }

    public void setButName(String butName) {
        this.butName = butName;
    }

    public String getStore_id() {
        return store_id;
    }

    public void setStore_id(String store_id) {
        this.store_id = store_id;
    }
}

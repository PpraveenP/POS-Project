package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.NoArgsConstructor;

import javax.persistence.*;
@NoArgsConstructor
@Entity
@Table(name = "state")
public class State {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "state_id")
    private Long state_id;
    @Column(name = "state_name")
    private String state_name;
    @Column(name = "country_id")
    private Long country_id;

    public Long getState_id() {
        return state_id;
    }

    public void setState_id(Long state_id) {
        this.state_id = state_id;
    }

    public String getState_name() {
        return state_name;
    }

    public void setState_name(String state_name) {
        this.state_name = state_name;
    }

    public Long getCountry_id() {
        return country_id;
    }

    public void setCountry_id(Long country_id) {
        this.country_id = country_id;
    }


}


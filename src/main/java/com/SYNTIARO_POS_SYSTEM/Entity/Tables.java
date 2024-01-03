package com.SYNTIARO_POS_SYSTEM.Entity;

import javax.persistence.*;

@Entity
@Table(name = "Tables")
public class Tables {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long serial_no;
  private String tablename;

  private long chair;

  private String storeid;


    public Tables(long serial_no, String tablename, long chair, String storeid) {
        this.serial_no = serial_no;
        this.tablename = tablename;
        this.chair = chair;
        this.storeid = storeid;
    }

    public Tables() {
    }

    public long getSerial_no() {
        return serial_no;
    }

    public void setSerial_no(long serial_no) {
        this.serial_no = serial_no;
    }

    public String getTablename() {
        return tablename;
    }

    public void setTablename(String tablename) {
        this.tablename = tablename;
    }

    public long getChair() {
        return chair;
    }

    public void setChair(long chair) {
        this.chair = chair;
    }

    public String getStoreid() {
        return storeid;
    }

    public void setStoreid(String storeid) {
        this.storeid = storeid;
    }
}

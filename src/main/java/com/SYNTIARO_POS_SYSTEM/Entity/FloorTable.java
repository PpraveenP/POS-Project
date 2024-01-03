package com.SYNTIARO_POS_SYSTEM.Entity;

import javax.persistence.*;
import javax.persistence.Table;
import java.util.List;

@Entity
@Table(name = "Floor_Table")
public class FloorTable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long serial_no;

//    @Column(name="floor_id")
//    private long id;

    private String floorname;

    @OneToMany(targetEntity = Tables.class,cascade = CascadeType.ALL)
    @JoinColumn(name = "floor_table_id",referencedColumnName = "serial_no")
    private List<Tables> tables;

    @Column(name = "store_id")
    private long storeid;

    public FloorTable() {
    }

    public FloorTable(long serial_no, String floorname, List<Tables> tables, long storeid) {
        this.serial_no = serial_no;
        this.floorname = floorname;
        this.tables = tables;
        this.storeid = storeid;
    }

    public long getSerial_no() {
        return serial_no;
    }

    public void setSerial_no(long serial_no) {
        this.serial_no = serial_no;
    }

    public String getFloorname() {
        return floorname;
    }

    public void setFloorname(String floorname) {
        this.floorname = floorname;
    }

    public List<Tables> getTables() {
        return tables;
    }

    public void setTables(List<Tables> tables) {
        this.tables = tables;
    }

    public long getStoreid() {
        return storeid;
    }

    public void setStoreid(long storeid) {
        this.storeid = storeid;
    }
}

package com.SYNTIARO_POS_SYSTEM.Response;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@NoArgsConstructor
public class OrderResponse {

    private int id;
    private Date orddate;
    private String tblno;
    private String ordstatus;


    public OrderResponse(int id, Date orddate, String tblno, String ordstatus) {
        this.id = id;
        this.orddate = orddate;
        this.tblno = tblno;
        this.ordstatus = ordstatus;
    }
}

package com.SYNTIARO_POS_SYSTEM.Response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class BillResponse {

    private Integer id;
    private Date billdate;
    private String paymentmode;
    private String email;
    private String contact;
    private String tranid;
    private Integer total;
    private Date orddate;
    private String Tblno;
    private String ordstatus;
    private Integer oid;


}

package com.SYNTIARO_POS_SYSTEM.Request;

import com.SYNTIARO_POS_SYSTEM.Entity.Country;
import com.SYNTIARO_POS_SYSTEM.Entity.State;
import com.SYNTIARO_POS_SYSTEM.Entity.Tax;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class CountryRequest {

    private Country country;
    private List<State> states;

}

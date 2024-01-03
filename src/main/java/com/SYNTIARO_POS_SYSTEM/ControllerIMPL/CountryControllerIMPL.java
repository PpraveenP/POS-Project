package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Country;
import com.SYNTIARO_POS_SYSTEM.Entity.State;
import com.SYNTIARO_POS_SYSTEM.Repository.CountryRepository;
import com.SYNTIARO_POS_SYSTEM.Response.CountryResponse;
import com.SYNTIARO_POS_SYSTEM.Response.StateResponse;
import com.SYNTIARO_POS_SYSTEM.ServiceIMPL.CountryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/sys/api/countries")
public class CountryControllerIMPL {
    private final CountryRepository countryRepository;

    @Autowired
    CountryService countryService;
    @Autowired
    public CountryControllerIMPL(CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    @GetMapping("/countries")
    public List<Country> getAllCountries() {
        return countryRepository.findAll();
    }

    @GetMapping("/country-names")
    public List<Object> getAllCountryNames() {
        List<Country> countries = countryRepository.findAll();
        return countries.stream().map(Country::getCountryName).collect(Collectors.toList());
    }

    // THIS METHOD IS USE FOR GET COUNTRY BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Country> getCountryById(@PathVariable Long id) {
        Optional<Country> country = countryRepository.findById(id);
        return country.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    // THIS METHOD IS USE FOR GIVE INFO COUNTRY WISE
    @GetMapping("/info/{countryName}")
    public ResponseEntity<CountryResponse> getCountryInfo(@PathVariable String countryName) {
        Country countryInfo = countryService.getCountryInfo(countryName);
        if (countryInfo != null) {
            // Create a simplified CountryResponse object
            CountryResponse response = new CountryResponse();
            response.setCountry_id(countryInfo.getCountry_id());
            response.setCurrency(countryInfo.getCurrency());
            response.setCountry(countryInfo.getCountry());
            response.setCountry_code(countryInfo.getCountry_code());
            response.setCurrency_code(countryInfo.getCurrency_code());
            response.setCurrency_symbol(countryInfo.getCurrency_symbol());

            // Create a list of StateResponse objects
            List<StateResponse> stateResponses = new ArrayList<>();
            for (State state : countryInfo.getStates()) {
                StateResponse stateResponse = new StateResponse();
                stateResponse.setState_id(state.getState_id());
                stateResponse.setState_name(state.getState_name());
                stateResponses.add(stateResponse);
            }
            response.setStates(stateResponses);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

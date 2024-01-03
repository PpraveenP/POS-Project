package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Country;
import com.SYNTIARO_POS_SYSTEM.Repository.CountryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CountryService {

    private final CountryRepository countryRepository;

    @Autowired
    public CountryService (CountryRepository countryRepository) {
        this.countryRepository = countryRepository;
    }

    public Country getCountryInfo(String countryName) {
        return countryRepository.findByCountry(countryName);
    }
}


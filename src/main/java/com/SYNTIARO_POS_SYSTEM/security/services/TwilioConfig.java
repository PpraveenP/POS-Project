package com.SYNTIARO_POS_SYSTEM.security.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TwilioConfig {

    @Value("${twilio.accountSid}")
    private String accountSid;

    @Value("${twilio.authToken}")
    private String authToken;

    @Value("${twilio.twilioPhoneNumber}")
    private String twilioPhoneNumber;

    public String getAccountSid() {
        return accountSid;
    }

    public String getAuthToken() {
        return authToken;
    }

    public String getTwilioPhoneNumber() {
        return twilioPhoneNumber;
    }
}


package com.SYNTIARO_POS_SYSTEM.security.services;

import org.springframework.stereotype.Service;

@Service
public class OtpService {
    private final EmailSenderService emailService; // or SMSService



    public OtpService(EmailSenderService emailService) {
        this.emailService = emailService;
    }

    public void sendOtp(String email, String otp) {
        // Send the OTP via email or SMS
        emailService.sendEmail(email ,"Your OTP: " + otp,"done");
    }
}
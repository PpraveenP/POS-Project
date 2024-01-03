package com.SYNTIARO_POS_SYSTEM.Request;


public class UserOtpVerificationRequest {
    private String email;
    private String otp;

    // Getters and setters
    @Override
    public String toString() {
        return "UserOtpVerificationRequest{" +
                "email='" + email + '\'' +
                ", otp='" + otp + '\'' +
                '}';
    }

    public UserOtpVerificationRequest() {
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }
}

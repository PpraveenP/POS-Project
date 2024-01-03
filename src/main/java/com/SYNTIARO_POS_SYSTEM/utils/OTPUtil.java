package com.SYNTIARO_POS_SYSTEM.utils;

import org.apache.commons.lang3.RandomStringUtils;

public class OTPUtil {

    public static String generateOTP(int length) {
        return RandomStringUtils.randomNumeric(length);
    }

    public static boolean verifyOTP(String otp, String enteredOTP) {

        return otp.equals(enteredOTP);
    }
}

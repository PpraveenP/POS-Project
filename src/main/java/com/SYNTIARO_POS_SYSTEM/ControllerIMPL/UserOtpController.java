package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;


import com.SYNTIARO_POS_SYSTEM.Entity.UserOtpEntity;
import com.SYNTIARO_POS_SYSTEM.Repository.UserOtpRepository;
import com.SYNTIARO_POS_SYSTEM.Request.UserOtpVerificationRequest;
import com.SYNTIARO_POS_SYSTEM.security.services.OtpService;
import com.SYNTIARO_POS_SYSTEM.utils.OTPUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sys/otp")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserOtpController {
    @Autowired
    private OtpService otpService;

    private final UserOtpRepository userOtpRepository;

    public UserOtpController(OtpService otpService, UserOtpRepository userOtpRepository) {
        this.otpService = otpService;
        this.userOtpRepository = userOtpRepository;
    }

    //THIS METHOD IS USE FOR SEND THE VALIDE EMAIL FORM....USE....
    @PostMapping(path = "/sends")
    public ResponseEntity<String> sendOtp(@RequestBody UserOtpVerificationRequest request) {

        String email = request.getEmail();


        // Generate OTP
        String otp = OTPUtil.generateOTP(6);

        // Save OTP with expiration time
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);
        UserOtpEntity userOtpEntity = new UserOtpEntity();
        userOtpEntity.setEmail(String.valueOf(email));
        userOtpEntity.setOtp(otp);
        userOtpEntity.setExpirationTime(expirationTime);
        userOtpRepository.save(userOtpEntity);

        // Send OTP to the user
        otpService.sendOtp(String.valueOf(email), otp);

        return ResponseEntity.ok("OTP sent successfully");
    }

    //THIS METHOD IS USE FOR OTP VERIFICATION....USE....
    @PostMapping("/verify")
    public ResponseEntity<String> verifyOtp(@RequestBody UserOtpEntity request) {
        String email = request.getEmail();
        String otp = request.getOtp();

        // Retrieve the OTP entity from the database
        Pageable pageable = PageRequest.of(0, 1, Sort.by("expirationTime").descending());
        List<UserOtpEntity> otpEntities = userOtpRepository.findLatestByEmail(email, pageable);
        if (otpEntities.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid OTP" + email + "---" + otp);
        }
        UserOtpEntity userOtpEntity = otpEntities.get(0);

        // Check if OTP is expired
        LocalDateTime currentDateTime = LocalDateTime.now();
        if (currentDateTime.isAfter(userOtpEntity.getExpirationTime())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }
        // Check if OTP matches
        if (otp.equals(userOtpEntity.getOtp())) {
            // OTP is verified, perform further actions
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid OTP" + userOtpEntity.getOtp());
        }
    }

    //THIS METHOD IS USE FOR FIND THE DETAILS BY ID
    @GetMapping(path = "/mail/{id}")
    public Optional<UserOtpEntity> getbillbyid(@PathVariable Long id) {
        return userOtpRepository.findById(id);
    }

    //THIS METHOD IS USE FOR FIND THE LAST EMAIL DETAILS
    @GetMapping("/get/{email}")
    public ResponseEntity<UserOtpEntity> getLatestOtpByEmail(@PathVariable String email) {
        Pageable pageable = PageRequest.of(0, 1, Sort.by("expirationTime").descending());
        List<UserOtpEntity> otpEntities = userOtpRepository.findLatestByEmail(email, pageable);
        if (otpEntities.isEmpty()) {
            System.out.println("No UserOtpEntity found for email: " + email);
            return ResponseEntity.notFound().build();
        }
        UserOtpEntity latestUserOtpEntity = otpEntities.get(0);
        System.out.println("Latest UserOtpEntity for email: " + email);
        System.out.println(latestUserOtpEntity.toString());
        return ResponseEntity.ok(latestUserOtpEntity);
    }





}




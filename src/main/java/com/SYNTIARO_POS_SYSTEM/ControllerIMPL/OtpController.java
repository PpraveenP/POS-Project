package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.OtpEntity;
import com.SYNTIARO_POS_SYSTEM.Repository.OtpRepository;
import com.SYNTIARO_POS_SYSTEM.Request.OtpVerificationRequest;
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
public class OtpController {
    @Autowired
    private OtpService otpService;
    private final OtpRepository otpRepository;

    public OtpController(OtpService otpService, OtpRepository otpRepository) {
        this.otpService = otpService;
        this.otpRepository = otpRepository;
    }

    @PostMapping(path = "/store/send")
    public ResponseEntity<String> sendOtp(@RequestBody String email) {
        // Generate OTP
        String otp = OTPUtil.generateOTP(6);
        // Save OTP with expiration time
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);
        OtpEntity otpEntity = new OtpEntity();
        otpEntity.setEmail(email);
        otpEntity.setOtp(otp);
        otpEntity.setExpirationTime(expirationTime);
        otpRepository.save(otpEntity);
        // Send OTP to the user
        otpService.sendOtp(email, otp);
        return ResponseEntity.ok("OTP sent successfully");
    }

    // THIS METHOD IS USE FOR OTP VERIFICATION .....USE.....
    @PostMapping("/store/verify")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpEntity request) {
        String email = request.getEmail();
        String otp = request.getOtp();
        // Retrieve the OTP entity from the database
        Pageable pageable = PageRequest.of(0, 1, Sort.by("expirationTime").descending());
        List<OtpEntity> otpEntities = otpRepository.findLatestByEmail(email, pageable);
        if (otpEntities.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid OTP" + email + "---" + otp);
        }
        OtpEntity otpEntity = otpEntities.get(0);
        // Check if OTP is expired
        LocalDateTime currentDateTime = LocalDateTime.now();
        if (currentDateTime.isAfter(otpEntity.getExpirationTime())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }
        // Check if OTP matches
        if (otp.equals(otpEntity.getOtp())) {
            // OTP is verified, perform further actions
            return ResponseEntity.ok("OTP verified successfully");
        } else {
            return ResponseEntity.badRequest().body("Invalid OTP" + otpEntity.getOtp());
        }
    }

    // THIS METHOD IS USE FOR FIND DETAILS BY ID
    @GetMapping(path = "/mail/store/{id}")
    public Optional<OtpEntity> getbillbyid(@PathVariable Long id) {
        return otpRepository.findById(id);
    }

    // THIS METHOD IS USE FOR SEND VALID EMAIL FORM....USE....
    @PostMapping(path = "/store/sends")
    public ResponseEntity<String> sendOtp(@RequestBody OtpVerificationRequest request) {

        String email = request.getEmail();
        // Generate OTP
        String otp = OTPUtil.generateOTP(6);
        // Save OTP with expiration time
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);
        OtpEntity otpEntity = new OtpEntity();
        otpEntity.setEmail(String.valueOf(email));
        otpEntity.setOtp(otp);
        otpEntity.setExpirationTime(expirationTime);
        otpRepository.save(otpEntity);
        // Send OTP to the user
        otpService.sendOtp(String.valueOf(email), otp);
        return ResponseEntity.ok("OTP sent successfully");
    }

    // THIS METHOD IS USE FOR FIND THE LAST EMAIL DETAILS
    @GetMapping("/get/store/{email}")
    public ResponseEntity<OtpEntity> getLatestOtpByEmail(@PathVariable String email) {
        Pageable pageable = PageRequest.of(0, 1, Sort.by("expirationTime").descending());
        List<OtpEntity> otpEntities = otpRepository.findLatestByEmail(email, pageable);
        if (otpEntities.isEmpty()) {
            System.out.println("No OtpEntity found for email: " + email);
            return ResponseEntity.notFound().build();
        }
        OtpEntity latestOtpEntity = otpEntities.get(0);
        System.out.println("Latest OtpEntity for email: " + email);
        System.out.println(latestOtpEntity.toString());
        return ResponseEntity.ok(latestOtpEntity);
    }
}

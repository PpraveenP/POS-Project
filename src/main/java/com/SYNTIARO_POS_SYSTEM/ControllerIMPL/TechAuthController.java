package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.ERole;
import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import com.SYNTIARO_POS_SYSTEM.Entity.Tech;
import com.SYNTIARO_POS_SYSTEM.Entity.TechRole;
import com.SYNTIARO_POS_SYSTEM.Repository.*;
import com.SYNTIARO_POS_SYSTEM.Request.TechLoginRequest;
import com.SYNTIARO_POS_SYSTEM.Request.TechSignupRequest;
import com.SYNTIARO_POS_SYSTEM.Response.MessageResponse;
import com.SYNTIARO_POS_SYSTEM.Response.MessageUserResponse;
import com.SYNTIARO_POS_SYSTEM.Response.TechJwtResponse;
import com.SYNTIARO_POS_SYSTEM.security.jwt.TechJwtUtils;
import com.SYNTIARO_POS_SYSTEM.security.services.EmailSenderService;
import com.SYNTIARO_POS_SYSTEM.security.services.TechDetailsImpl;
import com.SYNTIARO_POS_SYSTEM.security.services.TechService;
import com.SYNTIARO_POS_SYSTEM.utils.OTPUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

//@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth/Tech")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TechAuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    StoreRepository storeRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TechRepository techRepository;

    @Autowired
    SuperAdminRepository superAdminRepository;

    @Autowired
    TechRoleRepository techRoleRepository;
    @Autowired
    TechService techService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    TechJwtUtils techJwtUtils;

    @Autowired
    EmailSenderService emailSenderService;

    @Autowired
    JavaMailSender javaMailSender;

    /// {----------------------MADE BY RUSHIKESH-----------------START
    /// HERE--------------------}
    private final Map<String, Set<String>> userSessions = new ConcurrentHashMap<>();
    private static final int MAX_SESSIONS_PER_USER = 250;

    /// {----------------------MADE BY RUSHIKESH-----------------END
    /// HETE--------------------}

    private String otp = OTPUtil.generateOTP(6);

    private final Map<String, String> emailToOtpMap = new HashMap<>();

    // THIS METHOD IS USE FOR STORE SIGNIN
    @PostMapping("/TechSignin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody TechLoginRequest techLoginRequest) {

        // ADDED BY RUSHIKESH --START--
        String username = techLoginRequest.getUsername();
        if (hasExceededSessionLimit(username)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Too many active sessions for this user.");
        }
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(techLoginRequest.getUsername(),
                        techLoginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = techJwtUtils.generateJwtToken(authentication);
        addUserSession(username, jwt);
        TechDetailsImpl userDetails = (TechDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());
        Optional<Tech> techOptional = techRepository.findByUsername(techLoginRequest.getUsername());
        if (techOptional.isPresent()) {
            Tech tech = techOptional.get();

        }
        return ResponseEntity.ok(new TechJwtResponse(jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                userDetails.getGstno(),
                roles)); // Include the logo URL in the response
    }

    /// {----------------------MADE THIS CHANGES RUSHIKESH-----------------START HERE--------------------}

    // Helper methods to manage user sessions
    private boolean hasExceededSessionLimit(String username) {
        return userSessions.getOrDefault(username, Collections.emptySet()).size() >= MAX_SESSIONS_PER_USER;
    }

    private void addUserSession(String username, String sessionToken) {
        userSessions.computeIfAbsent(username, k -> new HashSet<>()).add(sessionToken);
    }

    /// {----------------------MADE THIS CHANGES RUSHIKESH-----------------END
    /// HERE--------------------}

    // THIS METHOD IS USE FOR STORE SIGNUP
    @PostMapping("/techSignup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody TechSignupRequest techtechsignupRequest) {
        if (storeRepository.existsByUsername(techtechsignupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByUsername(techtechsignupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageUserResponse("Error: Username is already taken!"));
        }

        if (techRepository.existsByUsername(techtechsignupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (superAdminRepository.existsByUsername(techtechsignupRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Username is already taken!"));
        }

        if (techRepository.existsByEmail(techtechsignupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (userRepository.existsByEmail(techtechsignupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageUserResponse("Error: Email is already in use!"));
        }

        if (storeRepository.existsByEmail(techtechsignupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        if (superAdminRepository.existsByEmail(techtechsignupRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        String hashedPassword = encoder.encode(techtechsignupRequest.getPassword());
        if (techtechsignupRequest.getPassword().equals(techtechsignupRequest.getComfirmpassword())) {
            // Create new user's account
            Tech user = new Tech(techtechsignupRequest.getUsername(),
                    techtechsignupRequest.getSaddress(),
                    techtechsignupRequest.getEmail(),
                    techtechsignupRequest.getContact(),
                    techtechsignupRequest.getDate(),
                    techtechsignupRequest.getCountry(),
                    techtechsignupRequest.getState(),
                    techtechsignupRequest.getUpdatedby(),
                    techtechsignupRequest.getCreatedBy(),
                    techtechsignupRequest.getComfirmpassword(),
                    // techtechsignupRequest.getPassword(),
                    encoder.encode(techtechsignupRequest.getPassword()));

            Set<String> strRoles = techtechsignupRequest.getRole();
            Set<TechRole> techRoles = new HashSet<>();

            if (strRoles == null) {
                TechRole adminTechRole = techRoleRepository.findByName(ERole.ROLE_SUPPORT)
                        .orElseThrow(() -> new RuntimeException("Error: TechRole is not found."));
                techRoles.add(adminTechRole);
            } else {
                strRoles.forEach(role -> {
                    switch (role) {
                        case "user":
                            TechRole userTechRole = techRoleRepository.findByName(ERole.ROLE_USER)
                                    .orElseThrow(() -> new RuntimeException("Error: TechRole is not found."));
                            techRoles.add(userTechRole);
                            break;

                        case "mod":
                            TechRole modTechRole = techRoleRepository.findByName(ERole.ROLE_MODERATOR)
                                    .orElseThrow(() -> new RuntimeException("Error: TechRole is not found."));
                            techRoles.add(modTechRole);
                            break;

                        case "superAD":
                            TechRole superADTechRole = techRoleRepository.findByName(ERole.ROLE_SUPER_ADMIN)
                                    .orElseThrow(() -> new RuntimeException("Error: TechRole is not found."));
                            techRoles.add(superADTechRole);
                            break;

                        case "support":
                            TechRole supportTechRole = techRoleRepository.findByName(ERole.ROLE_SUPPORT)
                                    .orElseThrow(() -> new RuntimeException("Error: TechRole is not found."));
                            techRoles.add(supportTechRole);
                            break;

                        default:
                            TechRole adminTechRole = techRoleRepository.findByName(ERole.ROLE_SUPPORT)
                                    .orElseThrow(() -> new RuntimeException("Error: TechRole is not found."));
                            techRoles.add(adminTechRole);
                    }
                });
            }

            user.setTechRoles(techRoles);
            user.setComfirmpassword(techtechsignupRequest.getPassword());
            techRepository.save(user);

            emailSenderService.sendRegistrationSuccessfulEmailtech(user.getEmail(), user.getUsername(),
                    techtechsignupRequest.getPassword());

            return ResponseEntity.ok(new MessageResponse("Tech registered successfully!"));
        } else {

            return ResponseEntity.ok(new MessageResponse("PASSWORD DOES NOT MATCH!!!!!!"));

        }

    }

    // THIS METHOD IS USE FOR DELETE STORE
    @DeleteMapping("/{Techid}")
    public ResponseEntity<?> deleteStore(@PathVariable("Techid") Long techid) {
        Optional<Tech> storeOptional = techRepository.findById(techid);

        if (storeOptional.isPresent()) {
            Tech tech = storeOptional.get();

            techRepository.delete(tech);

            return ResponseEntity.ok(new MessageUserResponse("Tech deleted successfully!"));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // THIS METHOD IS USE FOR FETCH STORE BY ID
    @GetMapping("/stores/{techid}")
    public ResponseEntity<Tech> getStoreById(@PathVariable Long techid) {
        Optional<Tech> storeOptional = techRepository.findById(techid);

        if (storeOptional.isPresent()) {
            return ResponseEntity.ok(storeOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // THIS METHOD IS USE FOR UPDATE STORE

    // THIS METHOD IS USED FOR VERIFYING THE OTP AND UPDATING THE PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> resetRequest) {
        String email = resetRequest.get("email");
        String otp = resetRequest.get("otp");
        String newPassword = resetRequest.get("newPassword");
        String confirmPassword = resetRequest.get("comfirmPassword");

        // Check if the provided email exists in the emailToOtpMap and the OTP matches
        if (!emailToOtpMap.containsKey(email) || !emailToOtpMap.get(email).equals(otp)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP or Email");
        }

        // Check if the new password and confirmation match
        if (!Objects.equals(newPassword, confirmPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password and confirmation do not match");
        }

        // Check if the newPassword is not null and not empty
        if (StringUtils.isEmpty(newPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password cannot be empty");
        }

        // Update the password in the database
        Optional<Tech> optionalStore = techRepository.findByEmail(email);
        if (optionalStore.isPresent()) {
            Tech tech = optionalStore.get();
            tech.setPassword(encoder.encode(newPassword));
            tech.setComfirmpassword(newPassword);
            techRepository.save(tech);

            emailSenderService.sendPasswordChangedEmail(email, newPassword);

        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update password");
        }

        // Remove the email entry from the emailToOtpMap after successful password
        // update
        emailToOtpMap.remove(email);

        return ResponseEntity.ok("Password updated successfully");
    }

    // THIS METHOD IS USE FOR FORGET PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody TechSignupRequest techSignupRequest) {
        String email = techSignupRequest.getEmail();

        // Check if the email is associated with any existing store account
        Optional<Tech> optionalStore = techRepository.findByEmail(email);
        if (optionalStore.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tech account not found for the given email");
        }

        // Generate OTP
        String otp = OTPUtil.generateOTP(6);

        // Save the OTP in the emailToOtpMap to verify later
        emailToOtpMap.put(email, otp);

        // Send OTP via email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("OTP Verification for Password Reset");
        message.setText("Your OTP for password reset is: " + otp +"(Valid for 5 Mins.)"+"\n"+"Your Reset Technician Password:-"+"https://prod.ubsbill.com/techresetpassword");
        javaMailSender.send(message);

        return ResponseEntity.ok("OTP sent successfully to the provided email address");
    }

    // THIS METHOD IS USE FOR CHANGE PASSWORD OF STORE
    @PostMapping("/tech_change-password")
    public ResponseEntity<String> changePassword(@RequestBody TechSignupRequest techSignupRequest) {
        String username = techSignupRequest.getUsername();

        Optional<Tech> optionalStore = techRepository.findByUsername(username);
        if (optionalStore.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Tech not found");
        }

        Tech tech = optionalStore.get();

        // Verify old password
        if (!encoder.matches(techSignupRequest.getCurrentPassword(), tech.getPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password is incorrect");
        }

        // Verify new password and confirmation
        String newPassword = techSignupRequest.getNewPassword();
        String confirmPassword = techSignupRequest.getComfirmpassword();
        if (!Objects.equals(newPassword, confirmPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password and confirmation do not match");
        }

        // Check if the newPassword is not null and not empty
        if (StringUtils.isEmpty(newPassword)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password cannot be empty");
        }

        // Update the password and showpass
        try {
            tech.setPassword(encoder.encode(newPassword));
            tech.setComfirmpassword(newPassword);
            techRepository.save(tech);
        } catch (Exception e) {
            // Handle any potential exceptions that might occur during password update
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update password");
        }

        return ResponseEntity.ok("Password changed successfully");
    }

    // THIS METHOD IS USE FOR GET ALL STORE DETAIL
    @GetMapping("/gettech")
    // @PreAuthorize("hasRole('ADMIN')")
    public List<Tech> getStore() {
        return this.techService.getStore();
    }

    @GetMapping("/updated-tech/{techId}")
    public ResponseEntity<?> getUpdatedStoreInfo(@PathVariable Long techid) {
        Optional<Tech> optionalStore = techRepository.findById(techid);

        if (optionalStore.isPresent()) {
            Tech tech = optionalStore.get();

            // You can retrieve the hashed password, but you won't be able to retrieve the
            // plaintext password
            String hashedPassword = tech.getPassword();

            // Retrieve other tech information
            String username = tech.getUsername();
            String email = tech.getEmail();
            // Add other fields you want to retrieve

            // Create a map to hold the information
            Map<String, String> storeInfo = new HashMap<>();
            // storeInfo.put("Storeid", String.valueOf(tech.Storeid()));
            storeInfo.put("username", username);
            storeInfo.put("email", email);
            // Add other fields to the map

            return ResponseEntity.ok(storeInfo);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // THIS METHOD FOR FETCH ALL STORES
    @GetMapping("/alltech")
    public ResponseEntity<List<Tech>> getAllStores() {
        List<Tech> teches = techRepository.findAll();
        return ResponseEntity.ok(teches);
    }

    @PatchMapping("/UpdateStoreInfo/{storeId}")
    public ResponseEntity<?> updateStoreInfo(@PathVariable Long storeId,
            @Valid @RequestBody TechSignupRequest updateRequest) {
        Optional<Tech> optionalStore = techRepository.findById(storeId);

        if (!optionalStore.isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Tech not found!"));
        }

        Tech tech = optionalStore.get();

        if (updateRequest.getUsername() != null && !updateRequest.getUsername().isEmpty()) {
            if (techRepository.existsByUsername(updateRequest.getUsername())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Username is already taken!"));
            }
            tech.setUsername(updateRequest.getUsername());
        }

        if (updateRequest.getEmail() != null && !updateRequest.getEmail().isEmpty()) {
            if (techRepository.existsByEmail(updateRequest.getEmail())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }
            tech.setEmail(updateRequest.getEmail());
        }

        // Similarly, update other fields as needed...

        techRepository.save(tech);

        return ResponseEntity.ok(new MessageResponse("Tech information updated successfully!"));
    }

    @PatchMapping("/updatetech/{techid}")
    public ResponseEntity<String> updatestore(
            @PathVariable Long techid,
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String contact,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Date date,
            @RequestParam(required = false) String updatedby,
            @RequestParam(required = false) String createdBy) throws IOException {

        Optional<Tech> optionalTech = techRepository.findById(techid);
        if (!optionalTech.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        Tech tech = optionalTech.get();
        // Update fields if provided in the request
        if (username != null) {
            tech.setUsername(username);
        }
        if (address != null) {
            tech.setAddress(address);
        }
        if (email != null) {
            tech.setEmail(email);
        }

        if (contact != null) {
            tech.setContact(contact);
        }

        if (country != null) {
            tech.setCountry(country);
        }
        if (state != null) {
            tech.setState(state);
        }

        if (date != null) {
            tech.setDate(date);
        }

        if (createdBy != null) {
            tech.setCreatedBy(createdBy);
        }
        if (updatedby != null) {
            tech.setUpdatedby(updatedby);
        }

        // Save the updated store to the database
        techRepository.save(tech);

        return ResponseEntity.ok("Tech updated successfully!");
    }

    /*
     * {---------------------------------MADE CHANGES BY
     * RUSHIKESH-----------------------------}
     * -----------------------FOR LOGOUT THE USER --- END THE SESSION -- FOR THIS
     * CODE-------------------------------
     */
    @PostMapping("/Logout")
    public ResponseEntity<?> logoutUser(@RequestParam String sessionToken) {
        String username = getUsernameFromSessionToken(sessionToken);
        if (username == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid session token.");
        }

        // Remove the session token from the active sessions map
        removeUserSession(username, sessionToken);

        // Optionally, you can invalidate the JWT token here (e.g., by blacklisting it)

        return ResponseEntity.ok("Logged out successfully.");
    }

    private void removeUserSession(String username, String sessionToken) {
        userSessions.getOrDefault(username, Collections.emptySet()).remove(sessionToken);
    }

    private String getUsernameFromSessionToken(String sessionToken) {
        for (Map.Entry<String, Set<String>> entry : userSessions.entrySet()) {
            if (entry.getValue().contains(sessionToken)) {
                return entry.getKey();
            }
        }
        return null;
    }

}
package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.*;
import com.SYNTIARO_POS_SYSTEM.Repository.*;
import com.SYNTIARO_POS_SYSTEM.Request.StoreLoginRequest;
import com.SYNTIARO_POS_SYSTEM.Request.StoreSignupRequest;
import com.SYNTIARO_POS_SYSTEM.Response.MessageResponse;
import com.SYNTIARO_POS_SYSTEM.Response.MessageUserResponse;
import com.SYNTIARO_POS_SYSTEM.Response.StoreJwtResponse;
import com.SYNTIARO_POS_SYSTEM.ServiceIMPL.BalanceService;
import com.SYNTIARO_POS_SYSTEM.security.jwt.StoreJwtUtils;
import com.SYNTIARO_POS_SYSTEM.security.services.EmailSenderService;
import com.SYNTIARO_POS_SYSTEM.security.services.StoreDetailsImpl;
import com.SYNTIARO_POS_SYSTEM.security.services.StoreService;
import com.SYNTIARO_POS_SYSTEM.security.services.TwilioConfig;
import com.SYNTIARO_POS_SYSTEM.utils.OTPUtil;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.Valid;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
  @RequestMapping("/api/auth/store")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StoreAuthController {
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
  StoreRoleRepository storeRoleRepository;
  @Autowired
  StoreService storeService;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  StoreJwtUtils storeJwtUtils;

  @Autowired
  EmailSenderService emailSenderService;

  @Autowired
  JavaMailSender javaMailSender;

  @Autowired
  BalanceService balanceService;

  @Autowired
  private TwilioConfig twilioConfig;

  /// {----------------------MADE BY RUSHIKESH-----------------START
  /// HERE--------------------}
  private final Map<String, Set<String>> userSessions = new ConcurrentHashMap<>();
  private static final int MAX_SESSIONS_PER_USER = 500;

  /// {----------------------MADE BY RUSHIKESH-----------------END
  /// HETE--------------------}
  private String otp = OTPUtil.generateOTP(6);

  private final Map<String, String> emailToOtpMap = new HashMap<>();

  /// {----------------------MADE BY RUSHIKESH-----------------START
  /// HERE--------------------}
  @PostMapping("/storeSignin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody StoreLoginRequest storeLoginRequest) {

    Store user = storeRepository.findByUsername(storeLoginRequest.getUsername())
        .orElseThrow(() -> new UsernameNotFoundException("User not found"));

    // ADDED BY RUSHIKESH --START--
    String username = storeLoginRequest.getUsername();
    if (hasExceededSessionLimit(username)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body("Too many active sessions for this user.");
    }

    LocalDateTime expireDate = user.getSubscriptionExpiration(); // Fetch the user's expiration date
    LocalDateTime currentDate = LocalDateTime.now();
    if (currentDate.isBefore(expireDate)) {
      Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(storeLoginRequest.getUsername(), storeLoginRequest.getPassword()));
      SecurityContextHolder.getContext().setAuthentication(authentication);
      String jwt = storeJwtUtils.generateJwtToken(authentication);
      addUserSession(username, jwt); // ADDED BY RUSHIKEH
      StoreDetailsImpl userDetails = (StoreDetailsImpl) authentication.getPrincipal();
      List<String> roles = userDetails.getAuthorities().stream()
          .map(item -> item.getAuthority())
          .collect(Collectors.toList());

      // Assuming you have a logo URL field in the userDetails
      Optional<Store> storeOptional = storeRepository.findByUsername(storeLoginRequest.getUsername());

      String logoUrl = null; // Default value if logo URL is not present
      String storeName = null; // Default value if store name is not present

      if (storeOptional.isPresent()) {
        Store store = storeOptional.get();
        logoUrl = Arrays.toString(store.getLogo()); // Set the logo URL from the Store entity
        storeName = store.getStore_name(); // Set the store name

      }
      scheduleSubscriptionExpiryReminderEmails(user);
     // balanceService.updateRemainingBalancesForAllStores();

      return ResponseEntity.ok(new StoreJwtResponse(jwt,
          userDetails.getId(),
          userDetails.getUsername(),
          userDetails.getEmail(),
          userDetails.getGstno(),
          storeName,
          userDetails.getCurrency(),
          userDetails.getRegiNum(),
          userDetails.getContact(),
          userDetails.getCountry_code(),
          userDetails.getSaddress(),
          roles,
          logoUrl.getBytes())); // Include the logo URL in the response
    } else {
      String errorMessage = "Login failed: The login period has expired.";

      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("error", errorMessage);
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(errorResponse);
    }

  }

  /// {----------------------MADE THIS CHANGES RUSHIKESH-----------------START
  /// HERE--------------------}

  // Helper methods to manage user sessions
  private boolean hasExceededSessionLimit(String username) {
    return userSessions.getOrDefault(username, Collections.emptySet()).size() >= MAX_SESSIONS_PER_USER;
  }

  private void addUserSession(String username, String sessionToken) {
    userSessions.computeIfAbsent(username, k -> new HashSet<>()).add(sessionToken);
  }

  /// {----------------------MADE THIS CHANGES RUSHIKESH-----------------END
  /// HERE--------------------}

  @Scheduled(cron = "0 0 0 * * *") // Run every day at midnight

  private void scheduleSubscriptionExpiryReminderEmails(Store user) {
    LocalDateTime currentDate = LocalDateTime.now();
    LocalDateTime expiryDateMinusOneMonth = user.getSubscriptionExpiration().minusMonths(1);
    LocalDateTime expiryDateMinusTwoMonths = user.getSubscriptionExpiration().minusMonths(2);
    LocalDateTime expiryDateMinusFifteenDays = user.getSubscriptionExpiration().minusDays(15);
    LocalDateTime expiryDateMinusFiveDays = user.getSubscriptionExpiration().minusDays(5);
    LocalDateTime expiryDateMinusOneDay = user.getSubscriptionExpiration().minusDays(1);
    LocalDateTime expiryDate = user.getSubscriptionExpiration();

    Duration durationMinusOneMonth = Duration.between(currentDate, expiryDateMinusOneMonth);
    Duration durationMinusTwoMonths = Duration.between(currentDate, expiryDateMinusTwoMonths);
    Duration durationMinusFifteenDays = Duration.between(currentDate, expiryDateMinusFifteenDays);
    Duration durationMinusFiveDays = Duration.between(currentDate, expiryDateMinusFiveDays);
    Duration durationMinusOneDay = Duration.between(currentDate, expiryDateMinusOneDay);
    Duration durationexpiry = Duration.between(currentDate, expiryDate);

    System.out.println("Duration Month: " + durationexpiry + " days");

    int day = 5;

    if (durationMinusOneDay.toDays() <= 1) {
      emailSenderService.sendCustomEmailWithUrl(user.getEmail(),
          "Subscription Expiry Reminder, Your Subscription Expires in 1 day", "http://ubsbill.com/", 1,
          "" + user.getStoreid(), user.getUsername(), user.getStore_name(), user.getRegiNum());
    } else if (durationMinusFiveDays.toDays() <= 5) {
      emailSenderService.sendCustomEmailWithUrl(user.getEmail(),
          "Subscription Expiry Reminder, Your Subscription Expires in 5 days", "http://ubsbill.com/", 5,
          "" + user.getStoreid(), user.getUsername(), user.getStore_name(), user.getRegiNum());
    } else if (durationMinusFifteenDays.toDays() <= 15) {
      emailSenderService.sendCustomEmailWithUrl(user.getEmail(),
          "Subscription Expiry Reminder, Your Subscription Expires in 15 days", "http://ubsbill.com/", 15,
          "" + user.getStoreid(), user.getUsername(), user.getStore_name(), user.getRegiNum());
    } else if (durationMinusOneMonth.toDays() <= 30) {
      emailSenderService.sendCustomEmailWithUrl(user.getEmail(),
          "Subscription Expiry Reminder, Your Subscription Expires in 30 days", "http://ubsbill.com/", 30,
          "" + user.getStoreid(), user.getUsername(), user.getStore_name(), user.getRegiNum());
    } else if (durationMinusTwoMonths.toDays() <= 60) {
      emailSenderService.sendCustomEmailWithUrl(user.getEmail(),
          "Subscription Expiry Reminder, Your Subscription Expires in 60 days", "http://ubsbill.com/", 60,
          "" + user.getStoreid(), user.getUsername(), user.getStore_name(), user.getRegiNum());
    } else {
    }
  }

  ////////////////////////////////////// THIS METHOD IS USE FOR STORE SIGNUP
  ////////////////////////////////////// /////////////////////////////////////////////////////////////
  @PostMapping("/storeSignup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody StoreSignupRequest signUpRequestStore) {
    if (storeRepository.existsByUsername(signUpRequestStore.getUsername())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByUsername(signUpRequestStore.getUsername())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageUserResponse("Error: Username is already taken!"));
    }

    if (techRepository.existsByUsername(signUpRequestStore.getUsername())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (superAdminRepository.existsByUsername(signUpRequestStore.getUsername())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (storeRepository.existsByEmail(signUpRequestStore.getEmail())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Email is already in use!"));
    }

    if (techRepository.existsByEmail(signUpRequestStore.getEmail())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Email is already in use!"));
    }

    if (userRepository.existsByEmail(signUpRequestStore.getEmail())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageUserResponse("Error: Email is already in use!"));
    }

    if (superAdminRepository.existsByEmail(signUpRequestStore.getEmail())) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Email is already in use!"));
    }
    if (storeRepository.existsByContact(signUpRequestStore.getContact())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Contact is already in use!"));
    }
    String hashedPassword = encoder.encode(signUpRequestStore.getPassword());
    if (signUpRequestStore.getPassword().equals(signUpRequestStore.getComfirmpassword())) {
      // Create new user's account
      Store user = new Store(signUpRequestStore.getUsername(),
          signUpRequestStore.getSaddress(),
          signUpRequestStore.getEmail(),
          signUpRequestStore.getStore_name(),
          signUpRequestStore.getContact(),
          signUpRequestStore.getGstno(),
          signUpRequestStore.getDate(),
          signUpRequestStore.getCurrency(),
          signUpRequestStore.getCountry(),
          signUpRequestStore.getCountry_code(),
          signUpRequestStore.getState(),
          signUpRequestStore.getCreatedby(),
          signUpRequestStore.getUpdatedby(),
          signUpRequestStore.getComfirmpassword(),
          signUpRequestStore.getSubscriptionType(),
          // signUpRequestStore.getPassword(),
          encoder.encode(signUpRequestStore.getPassword()));

      // Set subscription expiration time (8544 hours from now)
      LocalDateTime subscriptionExpiration = LocalDateTime.now().plusHours(8544);
      user.setSubscriptionExpiration(subscriptionExpiration);
      Set<String> strRoles = signUpRequestStore.getRole();
      Set<StoreRole> storeRoles = new HashSet<>();

      if (strRoles == null) {
        StoreRole adminStoreRole = storeRoleRepository.findByName(ERole.ROLE_ADMIN)
            .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
        storeRoles.add(adminStoreRole);
      } else {
        strRoles.forEach(role -> {
          switch (role) {
            case "user":
              StoreRole userStoreRole = storeRoleRepository.findByName(ERole.ROLE_USER)
                  .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
              storeRoles.add(userStoreRole);
              break;

            case "mod":
              StoreRole modStoreRole = storeRoleRepository.findByName(ERole.ROLE_MODERATOR)
                  .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
              storeRoles.add(modStoreRole);
              break;

            case "superAD":
              StoreRole superADStoreRole = storeRoleRepository.findByName(ERole.ROLE_SUPER_ADMIN)
                  .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
              storeRoles.add(superADStoreRole);
              break;

            case "support":
              StoreRole supportStoreRole = storeRoleRepository.findByName(ERole.ROLE_SUPPORT)
                  .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
              storeRoles.add(supportStoreRole);
              break;

            default:
              StoreRole adminStoreRole = storeRoleRepository.findByName(ERole.ROLE_ADMIN)
                  .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
              storeRoles.add(adminStoreRole);
          }
        });
      }

      user.setStoreRoles(storeRoles);
      user.setComfirmpassword(user.getComfirmpassword());
      storeRepository.save(user);

      emailSenderService.sendRegistrationSuccessfulEmailstore(user.getEmail(), user.getUsername(),
          signUpRequestStore.getPassword());

      return ResponseEntity.ok(new MessageResponse("Store registered successfully!"));
    } else {

      return ResponseEntity.ok(new MessageResponse("PASSWORD DOES NOT MATCH!!!!!!"));

    }
  }

  //////////////////////////////////// paid Subscription//////////////////////////////////// /////////////////////////////////////////////


//  @PatchMapping("/storeSubscribePaid")
//  public ResponseEntity<?> subscribeToPaidSubscription(@RequestBody StoreSignupRequest storeSignupRequest) {
//    // Validate the input request data
//    if (StringUtils.isEmpty(storeSignupRequest.getUsername()) ||
//        StringUtils.isEmpty(storeSignupRequest.getEmail())) {
//      return ResponseEntity.badRequest().body(new MessageResponse("Invalid input data."));
//    }
//
//    // Check if the user exists in the repository
//    Optional<Store> existingUser = storeRepository.findByUsername(storeSignupRequest.getUsername());
//    if (existingUser.isEmpty()) {
//      return ResponseEntity.badRequest().body(new MessageResponse("User not found."));
//    }
//    Store user = existingUser.get();
//
//    // Validate the provided email
//    if (!storeSignupRequest.getEmail().equals(user.getEmail())) {
//      return ResponseEntity.badRequest().body(new MessageResponse("Invalid email."));
//    }
//
//    LocalDateTime currentDate = LocalDateTime.now();
//    LocalDateTime expireDate = user.getSubscriptionExpiration();
//
//    // Check if the subscription has already expired or is about to expire (e.g.,
//    // within 24 hours)
//    if (currentDate.isAfter(expireDate) || currentDate.plusHours(8544).isAfter(expireDate)) {
//
//      // Calculate the new expiration date for the paid subscription (8544 hours from
//      // now)
//      LocalDateTime newExpirationDate = currentDate.plusHours(8544);
//      String date = String.valueOf(newExpirationDate);
//      // Update the user's subscription expiration date to the new paid subscription
//      // date
//      user.setSubscriptionExpiration(newExpirationDate);
//      user.setSubscriptionType("paid");
//      storeRepository.save(user);
//      emailSenderService.sendRegistrationSuccessfulEmailPaidstore(user.getEmail(), user.getUsername(), date);
//      return ResponseEntity.ok(new MessageResponse("Paid subscription activated successfully."));
//    }
//    // If the subscription is still active, return an error response
//    return ResponseEntity.badRequest().body(new MessageResponse("Subscription is still active."));
//  }


  //-------------PAID SUBSCRIPTION BY SHRADHA------------------------//

  ////////// THIS METHOD IS USE FOR PAID SUBSCRIPTION ///////////

  @PatchMapping("/storeSubscribePaid")
  public ResponseEntity<?> subscribeToPaidSubscription(@RequestBody StoreSignupRequest storeSignupRequest) {
// Validate the input request data
    if (StringUtils.isEmpty(storeSignupRequest.getUsername()) ||
            StringUtils.isEmpty(storeSignupRequest.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Invalid input data."));
    }

// Check if the user exists in the repository
    Optional<Store> existingUser = storeRepository.findByUsername(storeSignupRequest.getUsername());
    if (existingUser.isEmpty()) {
      return ResponseEntity.badRequest().body(new MessageResponse("User not found."));
    }
    Store user = existingUser.get();

// Validate the provided email
    if (!storeSignupRequest.getEmail().equals(user.getEmail())) {
      return ResponseEntity.badRequest().body(new MessageResponse("Invalid email."));
    }

    LocalDateTime currentDate = LocalDateTime.now();
    // LocalDateTime expireDate = user.getSubscriptionExpiration();

    // Get the chosen subscription duration from the request
    int subscriptionDurationHours = 0;
    int chosenSubscription = Integer.parseInt(storeSignupRequest.getSubscriptionType());

    switch (chosenSubscription) {
      case 1:
        subscriptionDurationHours = 1 * 365 * 24;
        break;
      case 2:
        subscriptionDurationHours = 2 * 365 * 24;
        break;
      case 3:
        subscriptionDurationHours = 3 * 365 * 24;
        break;
      case 4:
        subscriptionDurationHours = 4 * 365 * 24;
        break;
      default:
        // Ensure that the subscription duration is greater than 0 hours (1 day minimum)
        if (chosenSubscription <= 0) {
          return ResponseEntity.badRequest().body(new MessageResponse("Error: Subscription duration must be greater than 0 years!"));
        }
        subscriptionDurationHours = chosenSubscription * 365 * 24;
    }

    // Calculate the new expiration date for the paid subscription
    LocalDateTime newExpirationDate = currentDate.plusHours(subscriptionDurationHours);
    String date = String.valueOf(newExpirationDate);

    // Update the user's subscription expiration date to the new paid subscription date
    user.setSubscriptionExpiration(newExpirationDate);
    user.setSubscriptionType("paid");
    storeRepository.save(user);
    emailSenderService.sendRegistrationSuccessfulEmailPaidstore(user.getEmail(), user.getUsername(), date);

    return ResponseEntity.ok(new MessageResponse("Paid subscription activated successfully."));
  }

  // THIS METHOD IS USE FOR RENEWSUBSCRIPTION USING REGISTRATION NUMBER
  @PatchMapping("/storeRenewSubscription")
  public ResponseEntity<?> renewSubscriptionByRegiNum(@RequestBody StoreSignupRequest request) {
    String regiNum = request.getRegiNum();

    Optional<Store> storeOptional = storeRepository.findByRegistrationNumber(regiNum);

    if (storeOptional.isPresent()) {
      Store store = storeOptional.get();

      LocalDateTime currentExpiration = store.getSubscriptionExpiration();
      LocalDateTime newExpiration = currentExpiration.plusHours(8544); // Renew subscription for 8544 hours (1 year)

      store.setSubscriptionExpiration(newExpiration);
      storeRepository.save(store);

      return ResponseEntity.ok(new MessageResponse("Subscription renewed successfully!"));
    } else {
      String errorMessage = "Store not found.";
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("error", errorMessage);
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(errorResponse);
    }
  }

  // THIS METHOD IS USE FOR DELETE STORE
  @DeleteMapping("/{storeId}")
  public ResponseEntity<?> deleteStore(@PathVariable("storeId") Long storeId) {
    Optional<Store> storeOptional = storeRepository.findById(storeId);

    if (storeOptional.isPresent()) {
      Store store = storeOptional.get();

      storeRepository.delete(store);

      return ResponseEntity.ok(new MessageUserResponse("Store deleted successfully!"));
    } else {
      return ResponseEntity.notFound().build();
    }
  }
  @GetMapping("/getstore/{storeId}")
  public ResponseEntity<Store> getStoreById(@PathVariable Long storeId) {
    Optional<Store> storeOptional = storeRepository.findById(storeId);

    if (storeOptional.isPresent()) {
      System.out.println("/getstore/{storeId}");
      return ResponseEntity.ok(storeOptional.get());

    } else {
      return ResponseEntity.notFound().build();
    }
  }

  // this code for fetch the logo //////////

  @GetMapping("/{storeId}/logo") // added by Rushi
  public ResponseEntity<byte[]> getStoreLogo(@PathVariable Long storeId) {
    balanceService.updateRemainingBalancesForAllStores();
    Optional<Store> store = storeRepository.findById(storeId);
    if (store.isPresent() && store.get().getLogo() != null) {
      byte[] logo = store.get().getLogo();
      System.out.println("/{storeId}/logo");
      return ResponseEntity.ok()
          .contentType(MediaType.IMAGE_JPEG) // You can adjust the MediaType based on your image format
          .body(logo);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  // THIS METHOD IS USE FOR UPDATE STORE
  @PatchMapping("/updatestore/{storeId}")
  public ResponseEntity<MessageResponse> updatestore(
          @PathVariable Long storeId,
          @RequestParam(required = false) String username,
          @RequestParam(required = false) String saddress,
          @RequestParam(required = false) String email,
          @RequestParam(required = false) String contact,
          @RequestParam(required = false) String store_name,
          @RequestParam(required = false) String gstno,
          @RequestParam(required = false) String currency,
          @RequestParam(required = false) String country,
          @RequestParam(required = false) String state,
          @RequestParam(required = false) Date date,
          @RequestParam(required = false) String password,
          @RequestParam(required = false) String Comfirmpassword,
          @RequestParam(required = false) MultipartFile logo) throws IOException {

    Optional<Store> optionalStore = storeRepository.findById(Long.valueOf(storeId));



    if (userRepository.existsByUsername(username)) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (techRepository.existsByUsername(username)) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (superAdminRepository.existsByUsername(username)) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(email)) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Email is already in use!"));
    }

    if (superAdminRepository.existsByEmail(email)) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Email is already in use!"));
    }


    if (techRepository.existsByEmail(email)) {
      return ResponseEntity
              .badRequest()
              .body(new MessageResponse("Error: Email is already in use!"));
    }

    if (!optionalStore.isPresent()) {
      return ResponseEntity.notFound().build();
    }
    Store store = optionalStore.get();
    // Update fields if provided in the request
    if (username != null) {
      store.setUsername(username);
    }
    if (saddress != null) {
      store.setSaddress(saddress);
    }
    if (email != null) {
      store.setEmail(email);
    }

    if (store_name != null) {
      store.setStore_name(store_name);
    }
    if (contact != null) {
      store.setContact(contact);
    }
    if (gstno != null) {
      store.setGstno(gstno);
    }
    if (currency != null) {
      store.setCurrency(currency);
    }
    if (country != null) {
      store.setCountry(country);
    }
    if (state != null) {
      store.setState(state);
    }
    if (logo != null) {
      store.setLogo(logo.getBytes());
    }
    if (date != null) {
      store.setDate(date);
    }
    if (password != null) {
      store.setPassword(password);
    }
    if (Comfirmpassword != null) {
      store.setComfirmpassword(Comfirmpassword);
    }

    // Save the updated store to the database
    storeRepository.save(store);

    return ResponseEntity
            .ok()
            .body(new MessageResponse("Store updated successfully!"));
  }

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
    Optional<Store> optionalStore = storeRepository.findByEmail(email);
    if (optionalStore.isPresent()) {
      Store store = optionalStore.get();
      store.setPassword(encoder.encode(newPassword));
      store.setComfirmpassword(newPassword);
      storeRepository.save(store);

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
  public ResponseEntity<?> forgotPassword(@RequestBody StoreSignupRequest storeSignupRequest) {
    String email = storeSignupRequest.getEmail();

    // Check if the email is associated with any existing store account
    Optional<Store> optionalStore = storeRepository.findByEmail(email);
    if (optionalStore.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Store account not found for the given email");
    }

    // Generate OTP
    String otp = OTPUtil.generateOTP(6);

    // Save the OTP in the emailToOtpMap to verify later
    emailToOtpMap.put(email, otp);

    // Send OTP via email
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(email);
    message.setSubject("OTP Verification for Password Reset");
    message.setText("Your OTP for password reset is: " + otp +"(Valid for 5 Mins.)"+"\n"+ "Your Reset Store Password:-"+"https://prod.ubsbill.com/resetpassword");
    javaMailSender.send(message);

    return ResponseEntity.ok("OTP sent successfully to the provided email address");
  }

  // THIS METHOD IS USE FOR CHANGE PASSWORD OF STORE
  @PostMapping("/store_change-password")
  public ResponseEntity<String> changePassword(@RequestBody StoreSignupRequest storeSignupRequest) {
    String username = storeSignupRequest.getUsername();

    Optional<Store> optionalStore = storeRepository.findByUsername(username);
    if (optionalStore.isEmpty()) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Store not found");
    }

    Store store = optionalStore.get();

    // Verify old password
    if (!encoder.matches(storeSignupRequest.getCurrentPassword(), store.getPassword())) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password is incorrect");
    }

    // Verify new password and confirmation
    String newPassword = storeSignupRequest.getNewPassword();
    String confirmPassword = storeSignupRequest.getComfirmpassword();
    if (!Objects.equals(newPassword, confirmPassword)) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password and confirmation do not match");
    }

    // Check if the newPassword is not null and not empty
    if (StringUtils.isEmpty(newPassword)) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("New password cannot be empty");
    }

    // Update the password and showpass
    try {
      store.setPassword(encoder.encode(newPassword));
      store.setComfirmpassword(newPassword);
      storeRepository.save(store);
    } catch (Exception e) {
      // Handle any potential exceptions that might occur during password update
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to update password");
    }

    return ResponseEntity.ok("Password changed successfully");
  }

  // THIS METHOD IS USE FOR GET ALL STORE DETAIL
  @GetMapping("/getstore")
  // @PreAuthorize("hasRole('ADMIN')")
  public List<Store> getStore() {
    System.out.println("/getstore");
    return this.storeService.getStore();

  }

  @GetMapping("/updated-store/{storeId}")
  public ResponseEntity<?> getUpdatedStoreInfo(@PathVariable Long storeId) {
    Optional<Store> optionalStore = storeRepository.findById(storeId);

    if (optionalStore.isPresent()) {
      Store store = optionalStore.get();

      String hashedPassword = store.getPassword();

      // Retrieve other store information
      String username = store.getUsername();
      String email = store.getEmail();
      // Add other fields you want to retrieve

      // Create a map to hold the information
      Map<String, String> storeInfo = new HashMap<>();
      storeInfo.put("username", username);
      storeInfo.put("email", email);
      // Add other fields to the map
      System.out.println("/updated-store/{storeId}");
      return ResponseEntity.ok(storeInfo);
    } else {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping("/allstore")
  public ResponseEntity<List<Store>> getAllStores() {
    List<Store> stores = storeRepository.findAll();
    System.out.println("/allstore");
    return ResponseEntity.ok(stores);
  }

  // THIS METHOD FOR FETCH ALL ROLE_SUPPORT
  @GetMapping("/support/allstores")
  public ResponseEntity<List<Store>> getAllSupportStores() {
    List<Store> supportStores = storeRepository.findByStoreRoles_Name(ERole.ROLE_SUPPORT);

    if (supportStores.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    System.out.println("/support/allstores");
    return ResponseEntity.ok(supportStores);
  }

  // THIS METHOD FOR FETCH ALL ROLE_ADMIN
  @GetMapping("/admin/allstores")
  public ResponseEntity<List<Store>> getAllStoresdetail() {
    List<Store> supportStores = storeRepository.findByStoreRoles_Name(ERole.ROLE_ADMIN);

    if (supportStores.isEmpty()) {
      return ResponseEntity.noContent().build();
    }
    System.out.println("/admin/allstores");
    return ResponseEntity.ok(supportStores);
  }

  // THIS METHOD IS USE FOR UPDATE SUPER ADMIN STORE
  @PatchMapping("/UpdateStoreInfo/{storeId}")
  public ResponseEntity<?> updateStoreInfo(@PathVariable Long storeId,
      @Valid @RequestBody StoreSignupRequest updateRequest) {
    Optional<Store> optionalStore = storeRepository.findById(storeId);

    if (!optionalStore.isPresent()) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Store not found!"));
    }

    Store store = optionalStore.get();

    if (updateRequest.getUsername() != null && !updateRequest.getUsername().isEmpty()) {
      if (storeRepository.existsByUsername(updateRequest.getUsername())) {
        return ResponseEntity
            .badRequest()
            .body(new MessageResponse("Error: Username is already taken!"));
      }
      store.setUsername(updateRequest.getUsername());
    }

    if (updateRequest.getEmail() != null && !updateRequest.getEmail().isEmpty()) {
      if (storeRepository.existsByEmail(updateRequest.getEmail())) {
        return ResponseEntity
            .badRequest()
            .body(new MessageResponse("Error: Email is already in use!"));
      }
      store.setEmail(updateRequest.getEmail());
    }

    storeRepository.save(store);

    return ResponseEntity.ok(new MessageResponse("Store information updated successfully!"));
  }

  @PostMapping("/storeFreeTrial")
  public ResponseEntity<?> registerStore(@Valid @RequestBody StoreSignupRequest signUpRequestStore) {
    if (storeRepository.existsByUsername(signUpRequestStore.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (storeRepository.existsByEmail(signUpRequestStore.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }
    if (storeRepository.existsByContact(signUpRequestStore.getContact())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Contact is already in use!"));
    }
    String hashedPassword = encoder.encode(signUpRequestStore.getPassword());
    if (signUpRequestStore.getPassword().equals(signUpRequestStore.getComfirmpassword())) {
      // Create new user's account
      Store user = new Store(signUpRequestStore.getUsername(),
          signUpRequestStore.getSaddress(),
          signUpRequestStore.getEmail(),
          signUpRequestStore.getStore_name(),
          signUpRequestStore.getContact(),
          signUpRequestStore.getGstno(),
          signUpRequestStore.getDate(),
          signUpRequestStore.getCurrency(),
          signUpRequestStore.getCountry(),
          signUpRequestStore.getCountry_code(),
          signUpRequestStore.getState(),
          signUpRequestStore.getCreatedby(),
          signUpRequestStore.getUpdatedby(),
          signUpRequestStore.getComfirmpassword(),
          signUpRequestStore.getSubscriptionType(),
          // signUpRequestStore.getPassword(),
          encoder.encode(signUpRequestStore.getPassword()));

      if (signUpRequestStore.isFreeTrialRequested()) {
        // Determine the free trial duration based on user's choice
        int freeTrialDurationHours = 0;

        // int DAys = Integer.parseInt(Day);

        switch (signUpRequestStore.getFreeTrialType()) {
          case 1:
            freeTrialDurationHours = 24;
            break;
          case 5:
            freeTrialDurationHours = 5 * 24;
            break;
          case 7:
            freeTrialDurationHours = 7 * 24;
            break;
          case 10:
            freeTrialDurationHours = 10 * 24;
            break;
          case 15:
            freeTrialDurationHours = 15 * 24;
            break;
          case 20:
            freeTrialDurationHours = 20 * 24;
            break;
          default:
            // Ensure that the free trial duration is greater than 0 hours (1 day minimum)
            if (signUpRequestStore.getFreeTrialType() <= 0) {
              return ResponseEntity
                      .badRequest()
                      .body(new MessageResponse("Error: Free trial duration must be greater than 0 days!"));
            }
            freeTrialDurationHours = 24 * signUpRequestStore.getFreeTrialType();
        }

        // Set subscription expiration time for the free trial
        LocalDateTime subscriptionExpiration = LocalDateTime.now().plusHours(freeTrialDurationHours);
        user.setSubscriptionExpiration(subscriptionExpiration);
        String date = String.valueOf(subscriptionExpiration);
      } else {

      }
      Set<String> strRoles = signUpRequestStore.getRole();
      Set<StoreRole> storeRoles = new HashSet<>();

      if (strRoles == null) {
        StoreRole adminStoreRole = storeRoleRepository.findByName(ERole.ROLE_ADMIN)
            .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
        storeRoles.add(adminStoreRole);
      } else {
        strRoles.forEach(role -> {
          switch (role) {
            case "user":
              StoreRole userStoreRole = storeRoleRepository.findByName(ERole.ROLE_USER)
                  .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
              storeRoles.add(userStoreRole);
              break;

            case "mod":
              StoreRole modStoreRole = storeRoleRepository.findByName(ERole.ROLE_MODERATOR)
                  .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
              storeRoles.add(modStoreRole);
              break;

            case "superAD":
              StoreRole superADStoreRole = storeRoleRepository.findByName(ERole.ROLE_SUPER_ADMIN)
                  .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
              storeRoles.add(superADStoreRole);
              break;

            case "support":
              StoreRole supportStoreRole = storeRoleRepository.findByName(ERole.ROLE_SUPPORT)
                  .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
              storeRoles.add(supportStoreRole);
              break;

            default:
              StoreRole adminStoreRole = storeRoleRepository.findByName(ERole.ROLE_ADMIN)
                  .orElseThrow(() -> new RuntimeException("Error: StoreRole is not found."));
              storeRoles.add(adminStoreRole);
          }
        });
      }

      LocalDateTime subscriptionExpiration = LocalDateTime.now().plusHours(24 * signUpRequestStore.getFreeTrialType());
      String date = String.valueOf(subscriptionExpiration);
      user.setStoreRoles(storeRoles);
      user.setComfirmpassword(user.getComfirmpassword());
      storeRepository.save(user);

      emailSenderService.sendRegistrationSuccessfulEmailfreestore(user.getEmail(), user.getUsername(),
          signUpRequestStore.getPassword(), signUpRequestStore.getFreeTrialType(), date);

      return ResponseEntity.ok(new MessageResponse("Store registered successfully!"));
    } else {

      return ResponseEntity.ok(new MessageResponse("PASSWORD DOES NOT MATCH!!!!!!"));

    }
  }

  // AFTER PAid Renew from old date SUBSCRIPTION by username
  @PatchMapping("/storeRenewByUsername")
  public ResponseEntity<?> renewSubscriptionByUsername(@RequestBody Map<String, String> requestBody) {
    String username = requestBody.get("username"); // Assuming the key for username is "username"

    Optional<Store> storeOptional = storeRepository.findByUsername(username);

    if (storeOptional.isPresent()) {
      Store store = storeOptional.get();

      LocalDateTime currentExpiration = store.getSubscriptionExpiration();
      LocalDateTime newExpiration = LocalDateTime.now().plusHours(8544); // Renew subscription for 8544 hours (1 year)

      store.setSubscriptionExpiration(newExpiration);
      storeRepository.save(store);

      return ResponseEntity.ok(new MessageResponse("Subscription renewed successfully!"));
    } else {
      String errorMessage = "Store not found.";
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("error", errorMessage);
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(errorResponse);
    }
  }

  // AFTER PAid Renew from old date SUBSCRIPTION by regi number
  @PatchMapping("/storeRenewByregiNum")
  public ResponseEntity<?> renewSubscriptionByregiNum(@RequestBody Map<String, String> requestBody) {
    String regiNum = requestBody.get("regiNum");

    Optional<Store> storeOptional = storeRepository.findByRegistrationNumber(regiNum);

    if (storeOptional.isPresent()) {
      Store store = storeOptional.get();

      LocalDateTime currentExpiration = store.getSubscriptionExpiration();
      LocalDateTime newExpiration = LocalDateTime.now().plusHours(8544); // Renew subscription for 8544 hours (1 year)

      store.setSubscriptionExpiration(newExpiration);
      storeRepository.save(store);
      String date = String.valueOf(newExpiration);
      emailSenderService.sendCustomEmails(storeOptional.get().getEmail(), "THANK YOU FOR RENEW SUBSCRIPTION !!!!!!!",
          "for this RegiNum:", storeOptional.get().getRegiNum(), "your new subscription is", date);

      return ResponseEntity.ok(new MessageResponse("Subscription renewed successfully!"));
    } else {
      String errorMessage = "Store not found.";
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("error", errorMessage);
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(errorResponse);
    }
  }

  /////////////////////////////////////////////// RENEW SUBSCRIPTION FORM OLD DATE
  /////////////////////////////////////////////// ///////////////////////////////////////////////////

  // THIS METHOD IS USE FOR RENEWSUBSCRIPTION USING STORE ID

  @PatchMapping("/storeRenewSubscriptionstoreId")
  public ResponseEntity<?> renewSubscriptionByStoreIdS(@RequestBody StoreSignupRequest request) {
    Long storeId = request.getStoreId();
    Optional<Store> storeOptional = storeRepository.findById(storeId);

    if (storeOptional.isPresent()) {
      Store store = storeOptional.get();

      LocalDateTime currentExpiration = store.getSubscriptionExpiration();
      LocalDateTime newExpiration = currentExpiration.plusHours(8544); // Renew subscription for 8544 hours (1 year)

      store.setSubscriptionExpiration(newExpiration);
      storeRepository.save(store);

      return ResponseEntity.ok(new MessageResponse("Subscription renewed successfully!"));
    } else {
      String errorMessage = "Store not found.";
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("error", errorMessage);
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(errorResponse);
    }
  }

  // THIS METHOD IS USE FOR RENEWSUBSCRIPTION USING REGISTRATION NUMBER
  @PatchMapping("/storeRenewSubscriptionregiNum")
  public ResponseEntity<?> renewSubscriptionByRegiNumS(@RequestBody StoreSignupRequest request) {
    String regiNum = request.getRegiNum();

    Optional<Store> storeOptional = storeRepository.findByRegistrationNumber(regiNum);

    if (storeOptional.isPresent()) {
      Store store = storeOptional.get();

      LocalDateTime currentExpiration = store.getSubscriptionExpiration();
      LocalDateTime newExpiration = currentExpiration.plusHours(8544); // Renew subscription for 8544 hours (1 year)

      store.setSubscriptionExpiration(newExpiration);
      storeRepository.save(store);

      return ResponseEntity.ok(new MessageResponse("Subscription renewed successfully!"));
    } else {
      String errorMessage = "Store not found.";
      Map<String, Object> errorResponse = new HashMap<>();
      errorResponse.put("error", errorMessage);
      return ResponseEntity.status(HttpStatus.NOT_FOUND)
          .body(errorResponse);
    }
  }

  // THIS CODE FOR GENERATING PDF OF ALL STORE DETAILS

  @GetMapping("/generate-pdf")
  public ResponseEntity<?> generatePDF(
      @RequestParam(name = "startDate", required = false) Date startDateStr,
      @RequestParam(name = "endDate", required = false) Date endDateStr) throws IOException, DocumentException {
    List<Store> storeList;
    Date startDate = null;
    Date endDate = null;

    if (startDateStr != null && endDateStr != null) {
      try {
        // Parse date strings into java.util.Date
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
        startDate = dateFormat.parse(String.valueOf(startDateStr));
        endDate = dateFormat.parse(String.valueOf(endDateStr));
      } catch (ParseException ex) {
        // Handle the parsing error here, e.g., return an error response
        return ResponseEntity.badRequest().body("Invalid date format");
      }

      // Filter the stores based on the date range
      storeList = storeRepository.findByCreatedDateBetween(startDate, endDate);
    } else {
      // If no date range is specified, retrieve all stores
      storeList = storeRepository.findAll();
    }

    if (storeList.isEmpty()) {
      return ResponseEntity.notFound().build();
    }

    ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
    Document document = new Document(PageSize.A4.rotate());
    PdfWriter.getInstance(document, byteArrayOutputStream);

    document.open();

    Paragraph title = new Paragraph("STORE DETAILS", new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD));
    title.setAlignment(Element.ALIGN_CENTER);
    document.add(title);

    PdfPTable table = new PdfPTable(10); // Number of columns
    table.setWidthPercentage(100);

    PdfPCell cell = new PdfPCell(new Phrase("Store ID", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
    table.addCell(cell);
    cell = new PdfPCell(new Phrase("Store Name.", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
    table.addCell(cell);
    cell = new PdfPCell(new Phrase("User Name", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
    table.addCell(cell);
    cell = new PdfPCell(new Phrase("Password", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
    table.addCell(cell);
    cell = new PdfPCell(new Phrase("Contact no", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
    table.addCell(cell);
    cell = new PdfPCell(new Phrase("Created By", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
    table.addCell(cell);
    cell = new PdfPCell(new Phrase("Created Date", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
    table.addCell(cell);
    cell = new PdfPCell(new Phrase("Subscription Type", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
    table.addCell(cell);
    cell = new PdfPCell(new Phrase("Subscription Expiration", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
    table.addCell(cell);
    cell = new PdfPCell(new Phrase("Registration no.", new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD)));
    table.addCell(cell);
    ;

    for (Store store : storeList) {
      table.addCell(String.valueOf(store.getStoreid()));
      table.addCell(store.getStore_name());
      table.addCell(store.getUsername());
      table.addCell(store.getComfirmpassword());
      table.addCell(store.getContact());
      table.addCell(store.getCreatedby());
      table.addCell(String.valueOf(store.getCreated_date()));
      table.addCell(store.getSubscriptionType());
      table.addCell(String.valueOf(store.getSubscriptionExpiration()));
      table.addCell(store.getRegiNum());

    }

    document.add(table);

    document.close();

    ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(byteArrayOutputStream.toByteArray());

    HttpHeaders headers = new HttpHeaders();
    headers.add("Content-Disposition", "attachment; filename=Store-details.pdf");

    return ResponseEntity
        .ok()
        .headers(headers)
        .contentType(MediaType.APPLICATION_PDF)
        .body(new InputStreamResource(byteArrayInputStream));
  }

  // {---------------------------------MADE CHANGES BY
  // RUSHIKESH-----------------------------}

  // FOR LOGOUT THE USER --- END THE SESSION -- FOR THIS CODE

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

  private void scheduleSubscriptionExpiryReminderEmails(StoreDetailsImpl userDetails) {
    // Implement your logic for scheduling subscription expiry reminder emails here
  }



}

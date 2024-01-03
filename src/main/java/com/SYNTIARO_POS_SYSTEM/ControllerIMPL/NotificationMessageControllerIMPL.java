package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;


import com.SYNTIARO_POS_SYSTEM.Entity.NotificationMessage;
import com.SYNTIARO_POS_SYSTEM.Repository.NotificationMessageRepository;
import com.SYNTIARO_POS_SYSTEM.Repository.StoreRepository;
import com.SYNTIARO_POS_SYSTEM.security.services.EmailSenderService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sys/notification")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NotificationMessageControllerIMPL {

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private NotificationMessageRepository notificationMessageRepository;


    @PostMapping("/create")
    public ResponseEntity<String> createNotificationMessage(@RequestBody NotificationMessage notificationMessage) {
        try {
            // Save the SAdmin object to the database
            notificationMessageRepository.save(notificationMessage);
            return ResponseEntity.ok("Notification created successfully and email sent.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating Notification: " + e.getMessage());
        }
    }




    @GetMapping("/last24")
    public List<NotificationMessage> getNotificationMessagesLast24Hours() {
        List<NotificationMessage> notificationMessages = notificationMessageRepository.findAll();
        // Get the current date and time
        LocalDateTime currentDateTime = LocalDateTime.now();
        LocalDateTime twentyFourHoursAgo = currentDateTime.minusHours(24);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
        String formattedTwentyFourHoursAgo = twentyFourHoursAgo.format(formatter).trim();
        List<NotificationMessage> validNotificationMessages = new ArrayList<>();
        for (NotificationMessage message : notificationMessages) {
            // Remove any leading or trailing spaces before parsing
            String messageDateTimeStr = message.getEndDatetime().trim();
            System.out.println(messageDateTimeStr);
            // Parse the datetime string from the message and compare
            LocalDateTime messageDateTime = LocalDateTime.parse(messageDateTimeStr, formatter);
            if (messageDateTime.isAfter(currentDateTime)) {
                validNotificationMessages.add(message);
            }
        }
        return validNotificationMessages;
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<String> updateNotificationMessage(@PathVariable Long id, @RequestBody NotificationMessage updatedMessage) {
        try {
            // Check if the notification message with the given ID exists in the database
            Optional<NotificationMessage> existingMessage = notificationMessageRepository.findById(id);

            if (existingMessage.isPresent()) {
                NotificationMessage notificationMessage = existingMessage.get();

                // Update the fields of the existing notification message with the new values
                if (updatedMessage.getDatetime() != null) {
                    notificationMessage.setDatetime(updatedMessage.getDatetime());
                }
                if (updatedMessage.getEmail() != null) {
                    notificationMessage.setEmail(updatedMessage.getEmail());
                }
                if (updatedMessage.getMessage() != null) {
                    notificationMessage.setMessage(updatedMessage.getMessage());
                }
                if (updatedMessage.getSubject() != null) {
                    notificationMessage.setSubject(updatedMessage.getSubject());
                }
                // Save the updated notification message to the database
                notificationMessageRepository.save(notificationMessage);
                return ResponseEntity.ok("Notification message updated successfully.");
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating notification message: " + e.getMessage());
        }
    }
}
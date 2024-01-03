package com.SYNTIARO_POS_SYSTEM.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;


@Service
public class  EmailSenderService {
    @Autowired
    JavaMailSender javaMailSender;

    @Autowired
    public EmailSenderService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    ////////////////////////////////////////////////////   THIS CODE FOR SEND REGISTRATION SUCCESSFUL & SEND LOGIN CREDENTIAL MAIL TO ADMIN   ////////////////////////////////////////////////////////////
    public void sendRegistrationSuccessfulEmailstore(String to, String username, String password) {
        String headerColor = "#03989e"; // Header color
        String rowColor = "#D9D9D9";   // Row color
        String linkColor = "#007BFF";  // Link color
        String textColor = "#333";     // Text color
        String backgroundColor = "#ffffff"; // Background color
        String logoUrl = "https://media.licdn.com/dms/image/D4D3DAQE_BQ2jQMrvGQ/image-scale_191_1128/0/1692938240104?e=1694854800&v=beta&t=Th9TSSY8TDdil4S3m7j8KlA873B2rJvnTONpkI2cOsM";
        String htmlContent = "<html><head><style>" +
                "body { font-family: Arial, sans-serif; color: " + textColor + "; }" +
                "h2 { color: " + headerColor + "; }" +
                "ul { list-style-type: disc; }" +
                "table { border-collapse: collapse; width: 100%; max-width: 600px; background-color: " + backgroundColor + "; }" +
                "th, td { text-align: left; padding: 10px; }" +
                "th { background-color: " + headerColor + "; color: white; }" +
                "tr:nth-child(even) { background-color: " + rowColor + "; }" +
                "table, th, td { border: 1px solid #ddd; }" +
                "a { color: " + linkColor + "; text-decoration: none; }" +
                "</style></head><body>" +
                "<div>" + // No need to specify text-align for center since it's the default for div
                "<img src='" + logoUrl + "' alt='' style='max-width: 300px;'>" + // Include the logo
                "</div>" +
                "<h2>Registration Successful</h2>" + // No need to specify text-align for center since it's the default for headings
                "<p><b>Dear " + username + " </b></p>" +
                "<p><b>Your registration for Syntiaro POS was successful. Welcome aboard! Here are your login credentials:</p></b>" +
                "<table>" +
                "<tr>" +
                "<td style='background-color: " + headerColor + "; color: white;'><strong>Login URL:</strong></td>" +
                "<td><a href='https://prod.ubsbill.com/login'>https://prod.ubsbill.com/login</a></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='background-color: " + headerColor + "; color: white;'><strong>Username:</strong></td>" +
                "<td>" + username + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='background-color: " + headerColor + ";color: white'><strong>Password:</strong></td>" +
                "<td>" + password + "</td>" +
                "</tr>" +
                "</table>" +
                "<p>Your restaurant profile is now live on our platform, and you can start listing your delicious dishes, setting up your menu, and attracting customers.<p>"+
                "<p> We recommend logging in to your account to complete your restaurant profile, add high-quality images, update your menu, and manage your reservations.</p>"+
                "<p>For security reasons, we strongly recommend changing your temporary password upon your first login.</p>"+
                "<p>If you have any questions or need assistance with any aspect of your restaurant listing, please feel free to reach out to our support team at <br>[tech.ubsbill@gmail.com]<br>[9112116622].</p>"+
                "<p>We are here to help you make the most of your presence on our platform.</p>"+
                "<p>Best regards,</p>"+
                "<p><b>Syntiaro Pos Team....</p></b>"+
                "</body></html>";

        sendCustomEmail(to, "Registration Successful", htmlContent);
    }


    ////////////////////////////////////////////////////   THIS CODE FOR SEND FREE TRIAL MAIL TO ADMIN   ////////////////////////////////////////////////////////////
    public void sendRegistrationSuccessfulEmailfreestore(String to, String username, String password, int day, String Date) {
        MimeMessage message = javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Registration For Free Trial Successful");
            Date date = new Date();

            // Color codes
            String headerColor = "#03989e"; // Header color
            String rowColor = "#d9d9d9";   // Row color
            String linkColor = "#007BFF";  // Link color
            String textColor = "#333";     // Text color
            String backgroundColor = "#ffffff"; // Background color
            String logoUrl = "https://media.licdn.com/dms/image/D4D3DAQE_BQ2jQMrvGQ/image-scale_191_1128/0/1692938240104?e=1694854800&v=beta&t=Th9TSSY8TDdil4S3m7j8KlA873B2rJvnTONpkI2cOsM";

            // HTML content with CSS styling
            String htmlContent = "<html><head><style>" +
                    "body { font-family: Arial, sans-serif; color: " + textColor + "; }" +
                    "h2 { color: " + headerColor + "; }" +
                    "ul { list-style-type: disc; }" +
                    "table { border-collapse: collapse; width: 100%; max-width: 600px; background-color: " + backgroundColor + "; }" +
                    "th, td { text-align: left; padding: 10px; }" +
                    "th { background-color: " + headerColor + "; color: white; }" +
                    "tr:nth-child(even) { background-color: " + rowColor + "; }" +
                    "table, th, td { border: 1px solid #ddd; }" +
                    "a { color: " + linkColor + "; text-decoration: none; }" +
                    "</style></head><body>" +
                    "<div>" + // No need to specify text-align for center since it's the default for div
                    "<img src='" + logoUrl + "' alt='' style='max-width: 300px;'>" + // Include the logo
                    "</div>" +
                    "<h2>Registration Successful For Free Trial</h2>" +
                    "<p><b>Dear " + username + " </b></p>"+
                    "<p><b>We are thrilled to have you on board as a trial user and we hope you're as excited as we are about what our software can offer you.<br> Your journey to  discovering the full potential of Syntiaro POS starts right now!</b></p>" +
                    "<p>To log in to your account, please use the following credentials:</p>" +
                    "<table>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Login URL:</strong></td>" +
                    "<td><a href='https://prod.ubsbill.com/login'>https://prod.ubsbill.com/login</a></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Username:</strong></td>" +
                    "<td>" + username + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Password:</strong></td>" +
                    "<td>" + password + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Free Trial Day:</strong></td>" +
                    "<td>" + day + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Registration Date:</strong></td>" +
                    "<td>" + date + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Expiry Date:</strong></td>" +
                    "<td>" + Date + "</td>" +
                    "</tr>" +
                    "</table>" +
                    "<p>Your restaurant profile is now live on our platform, and you can start listing your delicious dishes, setting up your menu, and attracting customers.</p>" +
                    "<p>We recommend logging in to your account to complete your restaurant profile, add high-quality images, update your menu, and manage your reservations.</p>" +
                    "<p>For security reasons, we strongly recommend changing your temporary password upon your first login.</p>" +
                    "<p>If you have any questions or need assistance with any aspect of your restaurant listing, please feel free to reach out to our support team at:<br>[tech.ubsbill@gmail.com]<br>[9112116622].</p>" +
                    "<p>We are here to help you make the most of your presence on our platform.</p>" +
                    "<p>Best regards,</p>" +
                    "<p>Syntiaro Pos Team..</p>" +
                    "</body></html>";

            helper.setText(htmlContent, true); // Set the HTML content as true

            javaMailSender.send(message);
        } catch (MessagingException e) {
            // Handle exception
            e.printStackTrace();
        }
    }



    ////////////////////////////////////////////////////   THIS CODE FOR SEND REGISTRATION FOR PAID SUBSCRIPTION  MAIL TO ADMIN   ////////////////////////////////////////////////////////////
    public void sendRegistrationSuccessfulEmailPaidstore(String to, String username, String date) {
        String headerColor = "#03989e"; // Header color
        String rowColor = "#D9D9D9";   // Row color
        String linkColor = "#007BFF";  // Link color
        String textColor = "#333";     // Text color
        String backgroundColor = "#ffffff"; // Background color
        String logoUrl = "https://media.licdn.com/dms/image/D4D3DAQE_BQ2jQMrvGQ/image-scale_191_1128/0/1692938240104?e=1694854800&v=beta&t=Th9TSSY8TDdil4S3m7j8KlA873B2rJvnTONpkI2cOsM";
        String htmlContent = "<html><head><style>" +
                "body { font-family: Arial, sans-serif; color: " + textColor + "; }" +
                "h2 { color: " + headerColor + "; }" +
                "ul { list-style-type: disc; }" +
                "table { border-collapse: collapse; width: 100%; max-width: 600px; background-color: " + backgroundColor + "; }" +
                "th, td { text-align: left; padding: 10px; }" +
                "th { background-color: " + headerColor + "; color: white; }" +
                "tr:nth-child(even) { background-color: " + rowColor + "; }" +
                "table, th, td { border: 1px solid #ddd; }" +
                "a { color: " + linkColor + "; text-decoration: none; }" +
                "</style></head><body>" +
                "<div>" + // No need to specify text-align for center since it's the default for div
                "<img src='" + logoUrl + "' alt='' style='max-width: 300px;'>" + // Include the logo
                "</div>" +
                "<h2>Registration Successful</h2>" + // No need to specify text-align for center since it's the default for headings

                "<p><b>Dear "  +username+ " </b></p>" +
                "<p><b>We are thrilled to welcome you to Syntiaro POS and thank you for choosing our paid subscription service. <br> Your decision to subscribe to our premium offering demonstrates your commitment to taking full advantage of our software's powerful <br> features and services. Here are some important details about your paid subscription:\n</p></b>" +
                "<table>" +
                "<tr>" +
                "<td style='background-color: " + headerColor + "; color: white;'><strong>Login URL:</strong></td>" +
                "<td><a href='https://prod.ubsbill.com/login'>https://prod.ubsbill.com/login</a></td>" +
                "</tr>" +
                "<tr>" +
                "<td style='background-color: " + headerColor + "; color: white;'><strong>Username:</strong></td>" +
                "<td>" + username + "</td>" +
                "</tr>" +
                "<tr>" +
                "<td style='background-color: " + headerColor + ";color: white'><strong>Expiry Date</strong></td>" +
                "<td>" + date + "</td>" +
                "</tr>" +
                "</table>" +
                "<p>Your restaurant profile is now live on our platform, and you can start listing your delicious dishes, setting up your menu, and attracting customers.<p>"+
                "<p> We recommend logging in to your account to complete your restaurant profile, add high-quality images, update your menu, and manage your reservations.</p>"+
                "<p>For security reasons, we strongly recommend changing your temporary password upon your first login.</p>"+
                "<p>If you have any questions or need assistance with any aspect of your restaurant listing, please feel free to reach out to our support team at <br>[tech.ubsbill@gmail.com]<br>[9112116622].</p>"+
                "<p>We are here to help you make the most of your presence on our platform.</p>"+
                "<p>Best regards,</p>"+
                "<p><b>Syntiaro Pos Team....</p></b>"+
                "</body></html>";

        sendCustomEmail(to, "Registration Successful", htmlContent);
    }




    ////////////////////////////////////////////////////   THIS CODE FOR SEND REGISTRATION SUCCESSFUL TO USER   ////////////////////////////////////////////////////////////
    public void sendRegistrationSuccessfulEmailuser(String to, String username, String password) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Registration Successful");

            // Color codes
            String headerColor = "#03989e"; // Header color
            String rowColor = "#d9d9d9";   // Row color
            String linkColor = "#007BFF";  // Link color
            String textColor = "#333";     // Text color
            String backgroundColor = "#ffffff"; // Background color
            String logoUrl = "https://media.licdn.com/dms/image/D4D3DAQE_BQ2jQMrvGQ/image-scale_191_1128/0/1692938240104?e=1694854800&v=beta&t=Th9TSSY8TDdil4S3m7j8KlA873B2rJvnTONpkI2cOsM";

            // Create the HTML content for the email with CSS styling
            String htmlContent = "<html><head><style>" +
                    "body { font-family: Arial, sans-serif; color: " + textColor + "; }" +
                    "h2 { color: " + headerColor + "; }" +
                    "ul { list-style-type: disc; }" +
                    "table { border-collapse: collapse; width: 100%; max-width: 600px; background-color: " + backgroundColor + "; }" +
                    "th, td { text-align: left; padding: 10px; }" +
                    "th { background-color: " + headerColor + "; color: white; }" +
                    "tr:nth-child(even) { background-color: " + rowColor + "; }" +
                    "table, th, td { border: 1px solid #ddd; }" +
                    "a { color: " + linkColor + "; text-decoration: none; }" +
                    "</style></head><body>" +
                    "<div>" + // No need to specify text-align for center since it's the default for div
                    "<img src='" + logoUrl + "' alt='' style='max-width: 300px;'>" + // Include the logo
                    "</div>" +
                    "<h2 style='text-align: center;'>Registration Successful</h2>" +
                    "<div style='text-align: center;'>" +
                    "</div>" +
                    "<p><b>Dear " +username+" </b></p>" +
                    "<p><b>We are thrilled to inform you that your registration with has been successfully completed. Welcome to our team!\n Here are your login credentials:</p></b>" +
                    "<table>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Login URL:</strong></td>" +
                    "<td><a href='https://prod.ubsbill.com/login'>https://prod.ubsbill.com/login</a></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Username:</strong></td>" +
                    "<td>" + username + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + ";color: white'><strong>Password:</strong></td>" +
                    "<td>" + password + "</td>" +
                    "</tr>" +
                    "</table>" +
                    "<p>Your restaurant profile is now live on our platform, and you can start listing your delicious dishes, setting up your menu, and attracting customers.<p>"+
                    "<p> We recommend logging in to your account to complete your restaurant profile, add high-quality images, update your menu, and manage your reservations.</p>"+
                    "<p>For security reasons, we strongly recommend changing your temporary password upon your first login.</p>"+
                    "<p>If you have any questions or need assistance with any aspect of your restaurant listing, please feel free to reach out to our support team at <br>[tech.ubsbill@gmail.com]<br>[9112116622].</p>"+
                    "<p>We are here to help you make the most of your presence on our platform.</p>"+
                    "<p>Best regards,</p>"+
                    "<p><b>Syntiaro Pos Team....</p></b>"+
                    "</body></html>";

            sendCustomEmail(to, "Registration Successful", htmlContent);
            helper.setText(htmlContent, true); // Set the HTML content as true

            javaMailSender.send(message);
        } catch (MessagingException e) {
            // Handle exception
            e.printStackTrace();
        }
    }


    ////////////////////////////////////////////////////   THIS CODE FOR SEND REGISTRATION SUCCESSFUL & LOGIN CREDENTIAL TO ADMIN   ////////////////////////////////////////////////////////////
    public void sendRegistrationSuccessfulEmailadmin(String to,String username,String password) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Registration Successful");

            // Color codes
            String headerColor = "#03989e"; // Header color
            String rowColor = "#d9d9d9";   // Row color
            String linkColor = "#007BFF";  // Link color
            String textColor = "#333";     // Text color
            String backgroundColor = "#ffffff"; // Background color
            String logoUrl = "https://media.licdn.com/dms/image/D4D3DAQE_BQ2jQMrvGQ/image-scale_191_1128/0/1692938240104?e=1694854800&v=beta&t=Th9TSSY8TDdil4S3m7j8KlA873B2rJvnTONpkI2cOsM";

            // Create the HTML content for the email with CSS styling
            String htmlContent = "<html><head><style>" +
                    "body { font-family: Arial, sans-serif; color: " + textColor + "; }" +
                    "h2 { color: " + headerColor + "; }" +
                    "ul { list-style-type: disc; }" +
                    "table { border-collapse: collapse; width: 100%; max-width: 600px; background-color: " + backgroundColor + "; }" +
                    "th, td { text-align: left; padding: 10px; }" +
                    "th { background-color: " + headerColor + "; color: white; }" +
                    "tr:nth-child(even) { background-color: " + rowColor + "; }" +
                    "table, th, td { border: 1px solid #ddd; }" +
                    "a { color: " + linkColor + "; text-decoration: none; }" +
                    "</style></head><body>" +
                    "<div>" + // No need to specify text-align for center since it's the default for div
                    "<img src='" + logoUrl + "' alt='' style='max-width: 300px;'>" + // Include the logo
                    "</div>" +
                    "<h2>Registration Successful</h2>" +
                    "<div style='text-align: center;'>" +
                    "</div>" +
                    "<p><b>Dear " +username+ " </b></p>" +
                    "<p><b>Your registration for Hotel Management System is successful. Here are your login credentials:</p></b>" +
                    "<table>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Login URL:</strong></td>" +
                    "<td><a href='https://prod.ubsbill.com/login'>https://prod.ubsbill.com/login</a></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Username:</strong></td>" +
                    "<td>" + username + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + ";color: white'><strong>Password:</strong></td>" +
                    "<td>" + password + "</td>" +
                    "</tr>" +
                    "</table>" +
                    "<p>Your restaurant profile is now live on our platform, and you can start listing your delicious dishes, setting up your menu, and attracting customers.<p>"+
                    "<p> We recommend logging in to your account to complete your restaurant profile, add high-quality images, update your menu, and manage your reservations.</p>"+
                    "<p>For security reasons, we strongly recommend changing your temporary password upon your first login.</p>"+
                    "<p>If you have any questions or need assistance with any aspect of your restaurant listing, please feel free to reach out to our support team at <br>[tech.ubsbill@gmail.com]<br>[9112116622].</p>"+
                    "<p>We are here to help you make the most of your presence on our platform.</p>"+
                    "<p>Best regards,</p>"+
                    "<p><b>Syntiaro Pos Team....</p></b>"+
                    "</body></html>";

            // Set the HTML content of the email
            helper.setText(htmlContent, true);

            // Send the email
            javaMailSender.send(message);
        } catch (MessagingException e) {
            // Handle exception
            e.printStackTrace();
        }
    }






    //////////////////  THIS CODE FOR SEND REGISTRATION SUCCESSFUL & SEND LOGIN CREDENTIAL MAIL  TO TECHNICIAN //////////////////////////////////

    public void sendRegistrationSuccessfulEmailtech(String to,String username,String password) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Registration Successful");

            // Color codes
            String headerColor = "#03989e"; // Header color
            String rowColor = "#d9d9d9";   // Row color
            String linkColor = "#007BFF";  // Link color
            String textColor = "#333";     // Text color
            String backgroundColor = "#ffffff"; // Background color
            String logoUrl = "https://media.licdn.com/dms/image/D4D3DAQE_BQ2jQMrvGQ/image-scale_191_1128/0/1692938240104?e=1694854800&v=beta&t=Th9TSSY8TDdil4S3m7j8KlA873B2rJvnTONpkI2cOsM";

            // Create the HTML content for the email with CSS styling
            String htmlContent = "<html><head><style>" +
                    "body { font-family: Arial, sans-serif; color: " + textColor + "; }" +
                    "h2 { color: " + headerColor + "; }" +
                    "ul { list-style-type: disc; }" +
                    "table { border-collapse: collapse; width: 100%; max-width: 600px; background-color: " + backgroundColor + "; }" +
                    "th, td { text-align: left; padding: 10px; }" +
                    "th { background-color: " + headerColor + "; color: white; }" +
                    "tr:nth-child(even) { background-color: " + rowColor + "; }" +
                    "table, th, td { border: 1px solid #ddd; }" +
                    "a { color: " + linkColor + "; text-decoration: none; }" +
                    "</style></head><body>" +
                    "<div>" + // No need to specify text-align for center since it's the default for div
                    "<img src='" + logoUrl + "' alt='' style='max-width: 300px;'>" + // Include the logo
                    "</div>" +
                    "<h2 style='text-align: center;'>Registration Successful</h2>" +
                    "<div style='text-align: center;'>" +
                    "</div>" +
                    "<p><b>Dear " +username+ " </b></p>" +
                    "<p><b>Your registration for Hotel Management System is successful. <br>Here are your login credentials:</p></b>" +
                    "<table>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Login URL:</strong></td>" +
                    "<td><a href='https://prod.ubsbill.com/login'>https://prod.ubsbill.com/login</a></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Username:</strong></td>" +
                    "<td>" + username + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + ";color: white'><strong>Password:</strong></td>" +
                    "<td>" + password + "</td>" +
                    "</tr>" +
                    "</table>" +
                    "<p>Your restaurant profile is now live on our platform, and you can start listing your delicious dishes, setting up your menu, and attracting customers.<p>" +
                    "<p> We recommend logging in to your account to complete your restaurant profile, add high-quality images, update your menu, and manage your reservations.</p>" +
                    "<p>For security reasons, we strongly recommend changing your temporary password upon your first login.</p>" +
                    "<p>If you have any questions or need assistance with any aspect of your restaurant listing, please feel free to reach out to our support team at <br>[tech.ubsbill@gmail.com]<br>[9112116622].</p>" +
                    "<p>We are here to help you make the most of your presence on our platform.</p>" +
                    "<p>Best regards,</p>" +
                    "<p><b>Syntiaro Pos Team....</p></b>" +
                    "</body></html>";

            // Set the HTML content of the email
            helper.setText(htmlContent, true);

            // Send the email
            javaMailSender.send(message);
        } catch (MessagingException e) {
            // Handle exception
            e.printStackTrace();
        }
    }



    ////////////////////////////////////////////////////   THIS CODE FOR SEND MAIL FOR PASSWORD CHANGED  ////////////////////////////////////////////////////////////
    public void sendPasswordChangedEmail (String to, String password){

        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Registration Successful");

            // Color codes
            String headerColor = "#03989e"; // Header color
            String rowColor = "#d9d9d9";   // Row color
            String linkColor = "#007BFF";  // Link color
            String textColor = "#333";     // Text color
            String backgroundColor = "#ffffff"; // Background color
            String logoUrl = "https://media.licdn.com/dms/image/D4D3DAQE_BQ2jQMrvGQ/image-scale_191_1128/0/1692938240104?e=1694854800&v=beta&t=Th9TSSY8TDdil4S3m7j8KlA873B2rJvnTONpkI2cOsM";

            // Create the HTML content for the email with CSS styling
            String htmlContent = "<html><head><style>" +
                    "body { font-family: Arial, sans-serif; color: " + textColor + "; }" +
                    "h2 { color: " + headerColor + "; }" +
                    "ul { list-style-type: disc; }" +
                    "table { border-collapse: collapse; width: 100%; max-width: 600px; background-color: " + backgroundColor + "; }" +
                    "th, td { text-align: left; padding: 10px; }" +
                    "th { background-color: " + headerColor + "; color: white; }" +
                    "tr:nth-child(even) { background-color: " + rowColor + "; }" +
                    "table, th, td { border: 1px solid #ddd; }" +
                    "a { color: " + linkColor + "; text-decoration: none; }" +
                    "</style></head><body>" +
                    "<div>" + // No need to specify text-align for center since it's the default for div
                    "<img src='" + logoUrl + "' alt='' style='max-width: 300px;'>" + // Include the logo
                    "</div>" +
                    "<h2>Password Change successfully.!!!!</h2>" +
                    "<div style='text-align: center;'>" +
                    "</div>" +
                    "<p><b>Dear User</b></p>" +
                    "<p><b>Your Password Change successfully. Here are your updated password:</p></b>" +
                    "<table>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Login URL:</strong></td>" +
                    "<td><a href='https://prod.ubsbill.com/login'>https://prod.ubsbill.com/login</a></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + ";color: white'><strong>Password:</strong></td>" +
                    "<td>" + password + "</td>" +
                    "</tr>" +
                    "</table>" +
                    "<p>Your restaurant profile is now live on our platform, and you can start listing your delicious dishes, setting up your menu, and attracting customers.<p>"+
                    "<p> We recommend logging in to your account to complete your restaurant profile, add high-quality images, update your menu, and manage your reservations.</p>"+
                    "<p>For security reasons, we strongly recommend changing your temporary password upon your first login.</p>"+
                    "<p>If you have any questions or need assistance with any aspect of your restaurant listing, please feel free to reach out to our support team at <br>[tech.ubsbill@gmail.com]<br>[9112116622].</p>"+
                    "<p>We are here to help you make the most of your presence on our platform.</p>"+
                    "<p>Best regards,</p>"+
                    "<p><b>Syntiaro Pos Team....</p></b>"+
                    "</body></html>";

            // Set the HTML content of the email
            helper.setText(htmlContent, true);

            // Send the email
            javaMailSender.send(message);
        } catch (MessagingException e) {
            // Handle exception
            e.printStackTrace();
        }
    }

    //////////   THIS CODE FOR SEND OTP TO USER   ///////////////////////////
    public void sendEmail(String email, String otpVerification, String s) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("OTP Verification");
        message.setText("Your OTP is: " + otpVerification);
        javaMailSender.send(message);

    }

    ////////////////   THIS CODE FOR SEND SUBSCRIPTION REMAINDER TO ADMIN   //////////////////////////////
    public void sendCustomEmailWithUrl(String recipientEmail, String subject, String url, int days, String Storeid, String username, String store_name, String regiNum) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(recipientEmail);
            helper.setSubject("Subscription Expiry Reminder!!!!");

            // Color codes
            String headerColor = "#03989e"; // Header color
            String rowColor = "#d9d9d9";   // Row color
            String linkColor = "#007BFF";  // Link color
            String textColor = "#333";     // Text color
            String backgroundColor = "#ffffff"; // Background color
            String logoUrl = "https://media.licdn.com/dms/image/D4D3DAQE_BQ2jQMrvGQ/image-scale_191_1128/0/1692938240104?e=1694854800&v=beta&t=Th9TSSY8TDdil4S3m7j8KlA873B2rJvnTONpkI2cOsM";

            // Create the HTML content for the email with CSS styling
            String htmlContent = "<html><head><style>" +
                    "body { font-family: Arial, sans-serif; color: " + textColor + "; }" +
                    "h2 { color: " + headerColor + "; }" +
                    "ul { list-style-type: disc; }" +
                    "table { border-collapse: collapse; width: 100%; max-width: 600px; background-color: " + backgroundColor + "; }" +
                    "th, td { text-align: left; padding: 10px; }" +
                    "th { background-color: " + headerColor + "; color: white; }" +
                    "tr:nth-child(even) { background-color: " + rowColor + "; }" +
                    "table, th, td { border: 1px solid #ddd; }" +
                    "a { color: " + linkColor + "; text-decoration: none; }" +
                    "</style></head><body>" +
                    "<div>" + // No need to specify text-align for center since it's the default for div
                    "<img src='" + logoUrl + "' alt='' style='max-width: 300px;'>" + // Include the logo
                    "</div>" +
                    "<h2>Subscription Expiry Remainder</h2>" +
                    "<p>Dear "+store_name+", \n We hope this message finds you well. We wanted to remind you that your subscription for SYNTIARO POS  is set to expire soon. \nWe value your continued support and would like to ensure uninterrupted access to our services</p>" +
                    "<table>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Subscription Expiry:</b></td>" +
                    "<td>" + days + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><strong>Renewal Link:</strong></td>" +
                    "<td><a href='http://ubsbill.com/'>http://ubsbill.com/</a></td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Store ID:</b></td>" +
                    "<td>" + Storeid + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Username:</b></td>" +
                    "<td>" + username + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Store Name</b></td>" +
                    "<td>" + store_name + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Registration Number:</b></td>" +
                    "<td>" + regiNum + "</td>" +
                    "</tr>" +
                    "</table>" +
                    "<p>Your restaurant profile is now live on our platform, and you can start listing your delicious dishes, setting up your menu, and attracting customers.<p>"+
                    "<p> We recommend logging in to your account to complete your restaurant profile, add high-quality images, update your menu, and manage your reservations.</p>"+
                    "<p>For security reasons, we strongly recommend changing your temporary password upon your first login.</p>"+
                    "<p>If you have any questions or need assistance with any aspect of your restaurant listing, please feel free to reach out to our support team at <br>[tech.ubsbill@gmail.com]<br>[9112116622].</p>"+
                    "<p>We are here to help you make the most of your presence on our platform.</p>"+
                    "<p>Best regards,</p>"+
                    "<p><b>Syntiaro Pos Team....</p></b>"+
                    "</body></html>";

            // Set the HTML content of the email
            helper.setText(htmlContent, true);

            // Send the email
            javaMailSender.send(message);
        } catch (Exception e) {
            // Handle any exceptions that may occur during sending
            e.printStackTrace();
        }
    }




    public void sendCustomEmail(String recipientEmail, String subject, String message) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        try {
            helper.setTo(recipientEmail);
            helper.setSubject(subject);
            helper.setText(message, true); // Set the second parameter to true to enable HTML content

            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // Handle exception here
            System.err.println("Error sending email: " + e.getMessage());

        }
    }


    /////////////////////////////   THIS CODE FOR SEND SUBSCRIPTION RENEW TO USER   ///////////////////////////////
    public void sendCustomEmails(String email, String s, String s1, String regiNum, String yourNewSubscriptionIs, String date) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(email);
            helper.setSubject("Your Subscription Renewed Successfully!");

            // Color codes
            String headerColor = "#03989e"; // Header color
            String rowColor = "#d9d9d9";   // Row color
            String linkColor = "#007BFF";  // Link color
            String textColor = "#333";     // Text color
            String backgroundColor = "#ffffff"; // Background color
            String logoUrl = "https://media.licdn.com/dms/image/D4D3DAQE_BQ2jQMrvGQ/image-scale_191_1128/0/1692938240104?e=1694854800&v=beta&t=Th9TSSY8TDdil4S3m7j8KlA873B2rJvnTONpkI2cOsM";

            // Create the HTML content for the email with CSS styling
            String htmlContent = "<html><head><style>" +
                    "body { font-family: Arial, sans-serif; color: " + textColor + "; }" +
                    "h2 { color: " + headerColor + "; }" +
                    "ul { list-style-type: disc; }" +
                    "table { border-collapse: collapse; width: 100%; max-width: 600px; background-color: " + backgroundColor + "; }" +
                    "th, td { text-align: left; padding: 10px; }" +
                    "th { background-color: " + headerColor + "; color: white; }" +
                    "tr:nth-child(even) { background-color: " + rowColor + "; }" +
                    "table, th, td { border: 1px solid #ddd; }" +
                    "a { color: " + linkColor + "; text-decoration: none; }" +
                    "</style></head><body>" +
                    "<div>" + // No need to specify text-align for center since it's the default for div
                    "<img src='" + logoUrl + "' alt='' style='max-width: 300px;'>" + // Include the logo
                    "</div>" +
                    "<h2>Your Subscription Renewed Successfully!</h2>" +
                    "<p>Dear user, Your Subscription renewed successfully!</p>" +
                    "<table>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Registration Number:</b></td>" +
                    "<td>" + email + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Registration Number:</b></td>" +
                    "<td>" + regiNum + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Subscription Expiration Date:</b></td>" +
                    "<td>" + date + "</td>" +
                    "</tr>" +
                    "</table>" +
                    "<p>Your restaurant profile is now live on our platform, and you can start listing your delicious dishes, setting up your menu, and attracting customers.<p>"+
                    "<p> We recommend logging in to your account to complete your restaurant profile, add high-quality images, update your menu, and manage your reservations.</p>"+
                    "<p>For security reasons, we strongly recommend changing your temporary password upon your first login.</p>"+
                    "<p>If you have any questions or need assistance with any aspect of your restaurant listing, please feel free to reach out to our support team at <br>[tech.ubsbill@gmail.com]<br>[9112116622].</p>"+
                    "<p>We are here to help you make the most of your presence on our platform.</p>"+
                    "<p>Best regards,</p>"+
                    "<p><b>Syntiaro Pos Team....</p></b>"+
                    "</body></html>";

            // Set the HTML content of the email
            helper.setText(htmlContent, true);

            // Send the email
            javaMailSender.send(message);
        } catch (Exception e) {
            // Handle any exceptions that may occur during sending
            e.printStackTrace();
        }
    }
    ////////////////////////////////////////////////////   THIS CODE FOR SEND LOGIN GREETINGS TO USER   ////////////////////////////////////////////////////////////
    public void sendCustomEmailWithUrls(String recipientEmail, String subject,  String Storeid, String username, String store_name, String regiNum) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(recipientEmail);
            helper.setSubject("THANK YOU FOR LOGIN!!!!");

            // Color codes
            String headerColor = "#03989e"; // Header color
            String rowColor = "#d9d9d9";   // Row color
            String linkColor = "#007BFF";  // Link color
            String textColor = "#333";     // Text color
            String backgroundColor = "#ffffff"; // Background color
            String logoUrl = "https://media.licdn.com/dms/image/D4D3DAQE_BQ2jQMrvGQ/image-scale_191_1128/0/1692938240104?e=1694854800&v=beta&t=Th9TSSY8TDdil4S3m7j8KlA873B2rJvnTONpkI2cOsM";

            // Create the HTML content for the email with CSS styling
            String htmlContent = "<html><head><style>" +
                    "body { font-family: Arial, sans-serif; color: " + textColor + "; }" +
                    "h2 { color: " + headerColor + "; }" +
                    "ul { list-style-type: disc; }" +
                    "table { border-collapse: collapse; width: 100%; max-width: 600px; background-color: " + backgroundColor + "; }" +
                    "th, td { text-align: left; padding: 10px; }" +
                    "th { background-color: " + headerColor + "; color: white; }" +
                    "tr:nth-child(even) { background-color: " + rowColor + "; }" +
                    "table, th, td { border: 1px solid #ddd; }" +
                    "a { color: " + linkColor + "; text-decoration: none; }" +
                    "</style></head><body>" +
                    "<div>" + // No need to specify text-align for center since it's the default for div
                    "<img src='" + logoUrl + "' alt='' style='max-width: 300px;'>" + // Include the logo
                    "</div>" +
                    "<h2>THANK YOU FOR LOGIN!!!!!!!!</h2>" +
                    "<p>Welcome back to Syntiaro POS We're thrilled to see you again.\n" + "</p>" +
                    "<table>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Store ID:</b></td>" +
                    "<td>" + Storeid + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>User Name:</b></td>" +
                    "<td>" + username + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Store Name</b></td>" +
                    "<td>" + store_name + "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td style='background-color: " + headerColor + "; color: white;'><b>Registration Number:</b></td>" +
                    "<td>" + regiNum + "</td>" +
                    "</tr>" +
                    "</table>" +
                    "<p>Your restaurant profile is now live on our platform, and you can start listing your delicious dishes, setting up your menu, and attracting customers.<p>"+
                    "<p> We recommend logging in to your account to complete your restaurant profile, add high-quality images, update your menu, and manage your reservations.</p>"+
                    "<p>For security reasons, we strongly recommend changing your temporary password upon your first login.</p>"+
                    "<p>If you have any questions or need assistance with any aspect of your restaurant listing, please feel free to reach out to our support team at <br>[tech.ubsbill@gmail.com]<br>[9112116622].</p>"+
                    "<p>We are here to help you make the most of your presence on our platform.</p>"+
                    "<p>Best regards,</p>"+
                    "<p><b>Syntiaro Pos Team....</p></b>"+
                    "</body></html>";

            // Set the HTML content of the email
            helper.setText(htmlContent, true);

            // Send the email
            javaMailSender.send(message);
        } catch (Exception e) {
            // Handle any exceptions that may occur during sending
            e.printStackTrace();
        }
    }




}
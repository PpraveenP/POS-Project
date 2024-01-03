package com.SYNTIARO_POS_SYSTEM.Request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Date;
import java.util.Set;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class TechSignupRequest {

    @NotBlank
    @Size(min = 3, max = 20)
    private String username;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
    private String CurrentPassword;
    private String comfirmpassword;
    private String NewPassword;


    private String saddress;


    @Size(max = 50)
    @Email
    @NotBlank
    private String email;

    private String contact;

    private Date date = new Date();

    private String country;
    private String state;
    private String createdBy;
    private String updatedby;
    private Date created_date = new Date();
    private Date updated_date = new Date();
    private Set<String> roles;


    public Set<String> getRole() {
        return this.roles;
    }

    public void setRole(Set<String> role) {
        this.roles = role;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCurrentPassword() {
        return CurrentPassword;
    }

    public void setCurrentPassword(String currentPassword) {
        CurrentPassword = currentPassword;
    }

    public String getComfirmpassword() {
        return comfirmpassword;
    }

    public void setComfirmpassword(String comfirmpassword) {
        this.comfirmpassword = comfirmpassword;
    }

    public String getNewPassword() {
        return NewPassword;
    }

    public void setNewPassword(String newPassword) {
        NewPassword = newPassword;
    }

    public String getSaddress() {
        return saddress;
    }

    public void setSaddress(String saddress) {
        this.saddress = saddress;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }



    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public void setUpdatedby(String updatedby) {
        this.updatedby = updatedby;
    }

    public Date getCreated_date() {
        return created_date;
    }

    public void setCreated_date(Date created_date) {
        this.created_date = created_date;
    }

    public Date getUpdated_date() {
        return updated_date;
    }

    public void setUpdated_date(Date updated_date) {
        this.updated_date = updated_date;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public String getUpdatedby() {
        return updatedby;
    }
}
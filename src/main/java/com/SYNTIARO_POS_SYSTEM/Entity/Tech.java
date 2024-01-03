package com.SYNTIARO_POS_SYSTEM.Entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.Random;
import java.util.Set;


@Data
@Entity
@Table(name = "Tech",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "username"),
                @UniqueConstraint(columnNames = "email")
        })
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Tech {

    @Id//STORE ID
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long techid;
    @Column(name="TechNumber")
    private String regiNum ;
// ALL DATABASE FILED

    @NotBlank
    @Size(max = 20)
    private String username;

    @Column(name="Store_Address")
    private String address;

    @NotBlank
    @Size(max = 50)
    @Email
    private String email;


    @Size(max = 10, min = 10)
    @Pattern(regexp = "\\d{10}", message = "Contact number must have exactly 10 digits")
    @Column(name = "Contact")
    private String contact;


    @Column(name = "Date")
    private Date date = new Date();


    @Column(name = "Country")
    private String country;

    @Column(name = "State")
    private String state;

    @Column(name = "Created_By")
    private String createdBy;

    @Column(name = "Updated_By")
    private String updatedby;

    @Column(name = "Created_Date")
    private Date created_date = new Date();

    @Column(name = "Updated_Date")
    private Date updated_date = new Date();

    private String comfirmpassword;


    @NotBlank
    @Size(max = 120)
    private String password;


    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable( name = "Tech_roles",
            joinColumns = @JoinColumn(name = "techid"),
            inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<TechRole> techRoles = new HashSet<>();



    @PostPersist
    public void generateStoreCode() {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
        String formattedDate = dateFormat.format(date);
        this.regiNum = "SSPL-TECH-" +formattedDate+"-"+ techid;
    }


    public Tech(String username, String address, String email, String contact, Date date, String country, String state,String updatedby , String createdBy, String comfirmpassword, String password) {
        this.username = username;
        this.address = address;
        this.email = email;
        this.contact = contact;
        this.date = date;
        this.country = country;
        this.state = state;
        this.updatedby = updatedby;
        this.createdBy = createdBy;
        this.comfirmpassword=comfirmpassword;
        this.password = password;
    }


    public Long getTechid() {
        return techid;
    }

    public void setTechid(Long techid) {
        this.techid = techid;
    }



    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<TechRole> getTechRoles() {
        return techRoles;
    }

    public void setTechRoles(Set<TechRole> techRoles) {
        this.techRoles = techRoles;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public String getUpdatedby() {
        return updatedby;
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

    public String getComfirmpassword() {
        return comfirmpassword;
    }

    public void setComfirmpassword(String comfirmpassword) {
        this.comfirmpassword = comfirmpassword;
    }


    public String getRegiNum() {
        return regiNum;
    }

    public void setRegiNum(String regiNum) {
        this.regiNum = regiNum;
    }
}
package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Button;
import com.SYNTIARO_POS_SYSTEM.Entity.Inventory;
import com.SYNTIARO_POS_SYSTEM.Repository.ButtonRepo;
import com.SYNTIARO_POS_SYSTEM.Service.ButtonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping(path = "/sys/Button")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ButtonController {


    @Autowired
    ButtonRepo buttonRepo;


    @Autowired
    ButtonService buttonService;

    @GetMapping("/getbutton/{store_id}")
    public ResponseEntity<List<Button>> getFoodsByStoreId(@PathVariable String store_id) {
        List<Button> Buttons = buttonRepo.findbyStoerid(store_id);
        return new ResponseEntity<>(Buttons, HttpStatus.OK);
    }

//    @PostMapping("/postbutton")
//    public Button createEntity(@RequestBody Button button) {
//        // Save the entity to the database
//        Button savedbutton = buttonRepo.save(button);
//
//        return savedbutton;
//    }

    @PostMapping("/postbutton")
    public ResponseEntity<?> createEntity(@RequestBody Button button) {
        // Check if a button with the same id and butname exists
        Button existingButton = buttonRepo.findButtonByIdAndButname(button.getStore_id(), button.getButName());

        if (existingButton != null) {
            // If a button with the same id and butname exists, return an error response
            return ResponseEntity.badRequest().body("A button with the same id and butname already exists.");
        }

        // If no button with the same id and butname exists, save the entity to the database
        Button savedButton = buttonRepo.save(button);

        return ResponseEntity.ok(savedButton);
    }


   @PatchMapping("/updateButton/{id}")
    public ResponseEntity<Button> updateButton(@PathVariable("id") Long id, @RequestBody Button button) {
        try {
            Button updateButton = buttonService.updateButton(Long.valueOf(id), button);
            if (updateButton != null) {
                return new ResponseEntity<>(updateButton, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getcategory/{id}")
    public Button fetchDetailsById(@PathVariable Long id) {
        if (id != null) {
            return buttonRepo.findById(id).orElse(null);
        } else {
            // Handle the case where id is null, e.g., by returning an appropriate response
            return null; // or return a custom response
        }
    }



    @DeleteMapping("/deletecategory/{id}")
    public ResponseEntity<HttpStatus> deleteButton(@PathVariable Long id) {
        try {
            if (id != null) {
                buttonRepo.deleteById(id);
                return new ResponseEntity<>(HttpStatus.OK);
            } else {
                // Handle the case where id is null, e.g., by returning an appropriate response
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST); // or return a custom response
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}

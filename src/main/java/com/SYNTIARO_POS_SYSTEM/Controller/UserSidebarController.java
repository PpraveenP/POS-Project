package com.SYNTIARO_POS_SYSTEM.Controller;

import com.SYNTIARO_POS_SYSTEM.Entity.UserSidebar;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(path = "/sys/UserSidebar")
public interface UserSidebarController {
    @GetMapping(path = "/allUser")
    List<UserSidebar> getUser();

    @GetMapping("/getUserBYID/{id}")
    public ResponseEntity<?> fetchDetailsById(@PathVariable Integer id);
    @PostMapping(path = "/save")
    public ResponseEntity<String> saveUser(@RequestBody UserSidebar userSidebar);

    @PutMapping(path = "/UserSidebar")
    public UserSidebar updateUser(@RequestBody UserSidebar userSidebar);

    @GetMapping(path = "/users/{username}")
    public ResponseEntity<UserSidebar> getUserByUsername(@PathVariable String username);

    @DeleteMapping(path = "/delete/{user_id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable String user_id);

}

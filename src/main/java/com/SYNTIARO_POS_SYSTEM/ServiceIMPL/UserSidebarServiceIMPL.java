package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Food;
import com.SYNTIARO_POS_SYSTEM.Entity.User;
import com.SYNTIARO_POS_SYSTEM.Entity.UserSidebar;
import com.SYNTIARO_POS_SYSTEM.Repository.UserSidebarRepo;
import com.SYNTIARO_POS_SYSTEM.Service.UserSidebarService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class UserSidebarServiceIMPL implements UserSidebarService {
    @Autowired
    private UserSidebarRepo userSidebarRepo;
    private int parseInt;

    //THIS METHOD IS USE FOR GET ALL LIST OF USER
    @Override
    public List<UserSidebar> getUsers() {
        return userSidebarRepo.findAll();
    }

    //THIS METHOD IS USE FOR DELETE USER
    @Override
    public void deleteuser(int i) {
        UserSidebar entity = userSidebarRepo.getOne((int) parseInt);
        userSidebarRepo.delete(entity);
    }

    // THIS METHOD IS USE FOR FETCH USERSIDEBAR BY ID
    @Override
    public Optional<UserSidebar> getUserDetailsById(Integer id) {
        return userSidebarRepo.findById(id);
    }

    //THIS METHOD IS USE FOR DO NOT TAKEN SAME USERNAME
    @Override
    public boolean isUsernameTaken(String username) {
        return userSidebarRepo.existsByUsername(username);
    }


    //THIS METHOD IS USE FOR ADD USER
    @Override
    public void saveUser(UserSidebar userSidebar) {
        UserSidebar users = new UserSidebar();
        users.setUsername(userSidebar.getUsername());
        userSidebarRepo.save(userSidebar);
    }


    //THIS METHOD IS USE FOR UPDATE USER
    @Override
    public UserSidebar updateUser(UserSidebar userSidebar) {
        userSidebarRepo.save(userSidebar);
        return userSidebar;
    }

}



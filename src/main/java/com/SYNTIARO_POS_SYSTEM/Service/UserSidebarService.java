package com.SYNTIARO_POS_SYSTEM.Service;

import com.SYNTIARO_POS_SYSTEM.Entity.Food;
import com.SYNTIARO_POS_SYSTEM.Entity.UserSidebar;

import java.util.List;
import java.util.Optional;

public interface UserSidebarService {
    //String addUser(UserSidebar user);
    boolean isUsernameTaken(String username);

    void saveUser(UserSidebar userSidebar);

    List<UserSidebar> getUsers();


    void deleteuser(int i);


    // THIS METHOD IS USE FOR FETCH USERSIDEBAR BY ID
    Optional<UserSidebar> getUserDetailsById(Integer id);

    UserSidebar updateUser(UserSidebar userSidebar);





}


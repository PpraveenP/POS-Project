package com.SYNTIARO_POS_SYSTEM.Request;

import com.SYNTIARO_POS_SYSTEM.Entity.UserSidebar;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.awt.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class UserSidebarRequest {
    private Menu menu;
    private UserSidebar userSidebar;
    private String username;

}

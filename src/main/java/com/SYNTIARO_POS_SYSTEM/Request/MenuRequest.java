package com.SYNTIARO_POS_SYSTEM.Request;

import javax.validation.constraints.*;
import java.util.Set;

public class MenuRequest {

  private Long id;
  @NotBlank
  @Size(min = 3, max = 20)
  private String username;

  private Set<String> menu;

  public Set<String> getMenu() {
    return menu;
  }

  public void setMenu(Set<String> menu) {
    this.menu = menu;
  }


  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }



}

package com.SYNTIARO_POS_SYSTEM.Response;

public class MessageUserResponse {
  private String message;

  public MessageUserResponse(String message) {
    this.message = message;
  }

  public String getMessage() {
    return message;
  }

  public void setMessage(String message) {
    this.message = message;
  }
}

package com.SYNTIARO_POS_SYSTEM.Controller;

import com.SYNTIARO_POS_SYSTEM.Entity.Food;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface FoodController {
  @GetMapping(path = "/getfood")
  public List<Food> getFood(String food);
  @PostMapping(path = "/postfood")
  public String addFood(@RequestBody Food food);
  @DeleteMapping(path = "/deletefood/{food_id}")
  public ResponseEntity<HttpStatus> deleteFood(@PathVariable String food_id);
  @GetMapping("/image/{id}")
  public ResponseEntity<String> getFoodImage(@PathVariable Integer id);
  @PatchMapping(path = "/updatedfoods/{Serial_no}")
  public ResponseEntity<Food> updateFood(@PathVariable("Serial_no") Integer Serial_no,
      @RequestBody Food food);
  @GetMapping("/getFoodByID/{food_id}")
  public ResponseEntity<?> getFoodById(@PathVariable Integer food_id);
  @PostMapping("/addfoods")
  ResponseEntity<String> addfoods(
      @RequestParam("food_name") String food_name,
      @RequestParam("description") String description,
      @RequestParam("foodcode") String foodcode,
      @RequestParam("category") String category,
      @RequestParam("subcategory") String subcategory,
      @RequestParam("update_by") String update_by,
      @RequestParam("gst_no") String gst_no,
      @RequestParam("created_by") String created_by,
      @RequestParam("store_id") String store_id,
      @RequestParam("price") Integer price,
      @RequestParam("image") String image);

  @PostMapping("/generateExcel/{store_id}")
  public ResponseEntity<byte[]> generateExcelByStoreId(@PathVariable String store_id );
  @PostMapping("/upload")
  public ResponseEntity<String> uploadFoodList(@RequestParam("store_id") String storeId,
      @RequestParam("file") MultipartFile file);

}

package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Controller.FoodController;
import com.SYNTIARO_POS_SYSTEM.Entity.Food;
import com.SYNTIARO_POS_SYSTEM.Entity.Store;
import com.SYNTIARO_POS_SYSTEM.Repository.FoodRepo;
import com.SYNTIARO_POS_SYSTEM.Service.FoodService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import reactor.core.publisher.Mono;
import reactor.core.publisher.Flux;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping(path = "/sys/Food")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FoodControllerIMPL implements FoodController {

    @Autowired
    private FoodService foodService;

    @Autowired
    private FoodRepo foodRepo;
    private Logger logger = LoggerFactory.getLogger(FoodController.class);

    // THIS METHOD IS USE FOR GET ALL LIST OF FOOD
    @Override
    public List<Food> getFood(String food) {
        return this.foodService.getFood();

    }

    // THIS METHOD IS USE FOR POST FOOD
    @Override
    public String addFood(@RequestBody Food food) {
        String id = foodService.addFood(food);
        return id;
    }

    // THIS METHOD IS USE FOR DELETE FOOD
    @Override
    public ResponseEntity<HttpStatus> deleteFood(@PathVariable String food_id) {
        try {
            this.foodService.deletefood(Integer.parseInt(food_id));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    public ResponseEntity<String> getFoodImage(@PathVariable Integer id) {
        Food food = foodRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + id));
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_JPEG);

        return new ResponseEntity<>(food.getImage(), headers, HttpStatus.OK);
    }

    // THIS METHOD IS USE FOR GET FOOD BY ID
    public Optional<Food> getFoodByid(Integer food_id) {
        return this.foodService.getfoodbyid(food_id);
    }

    // THIS METHOD IS USE FOR UPDATE FOOD
    @Override
    public ResponseEntity<Food> updateFood(@PathVariable("Serial_no") Integer Serial_no, @RequestBody Food food) {
        try {
            Food updateFood = foodService.updateFood(Serial_no, food);
            if (updateFood != null) {
                return new ResponseEntity<>(updateFood, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // THIS METHOD IS USE FOR FETCH FOOD BY ID
    @Override
    public ResponseEntity<?> getFoodById(Integer food_id) {
        Optional<Food> food = foodService.getfoodbyid(food_id);
        if (food.isPresent()) {
            return ResponseEntity.ok(food.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // THIS METHOD IS USE FOR FETCH FOOD BY STOREID
    @GetMapping("/foods/{storeId}")
    public ResponseEntity<List<Food>> getFoodsByStoreId(@PathVariable String storeId) {
        try {
            List<Food> foods = foodService.fetchFoodsByStoreId(storeId);
            if (foods.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(foods, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

//    @GetMapping("/foods/{storeId}")
//    public CompletableFuture<ResponseEntity<List<Food>>> getFoodsByStoreId(@PathVariable String storeId) {
//        try {
//            return CompletableFuture.supplyAsync(() -> {
//               // List<Food> foods = foodService.fetchFoodsByStoreId(storeId);
//                List<Food> foods =   foodRepo.findByStore_id(storeId);
//                if (foods.isEmpty()) {
//                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//                }
//                return new ResponseEntity<>(foods, HttpStatus.OK);
//            });
//        } catch (Exception e) {
//            return CompletableFuture.completedFuture(new ResponseEntity<>(HttpStatus.NOT_FOUND));
//        }
//    }

//------------------------- REDUCING TIME ------------------------------------
//   private Map<String, List<Food>> foodCache = new HashMap<>();
//
//  // private Map<String, List<Food>> foodCache = new ConcurrentHashMap<>();
//    @GetMapping("/foods/{storeId}")
//    public ResponseEntity<List<Food>> getFoodsByStoreId(@PathVariable String storeId) {
//        // Check if the request can be served from cache
//        List<Food> cachedFoods = foodCache.get(storeId);
//        if (cachedFoods != null) {
//            return ResponseEntity.ok(cachedFoods);
//        }
//
//        // If not in cache, fetch from the database
//        List<Food> foods = foodRepo.findByStore_id(storeId);
//        if (foods.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        // Cache the result for future requests
//        foodCache.put(storeId, foods);
//           return ResponseEntity.ok(foods);
//    }




    // THIS METHOD IS USE FOR NOT INSERT SAME FOOD NAME
    @Override
    public ResponseEntity<String> addfoods(
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
            @RequestParam("image") String image) {

        // Check if the food name already exists for the given store_id
        boolean foodExists = foodRepo.existsByFoodNameAndStoreId(food_name, store_id);
        if (foodExists) {
            System.out.println("Food with the same name already exists in this store.");
            return ResponseEntity.badRequest().body("Food with the same name already exists in this store.");
        }
        Food foods = new Food();
        foods.setFood_name(food_name);
        foods.setDescription(description);
        foods.setFoodcode(foodcode);
        foods.setCategory(category);
        foods.setSubcategory(subcategory);
        foods.setUpdate_by(update_by);
        foods.setCreated_by(created_by);
        foods.setGst_no(gst_no);
        foods.setStore_id(store_id);
        foods.setPrice(price);
//        foods.setImage("https://drive.google.com/uc?export=view&id="+image);
        foods.setImage(image);
        // ---------------ADDED NEW CODE-----BY RUSHIKESH-----------------------
        Integer lastBillNumber = foodRepo.findLastNumberForStore(store_id);
        foods.setFood_id(lastBillNumber != null ? lastBillNumber + 1 : 1);
        Food createdFood = foodRepo.save(foods);
        return ResponseEntity.status(HttpStatus.CREATED).body(String.valueOf(createdFood));
    }

    @PatchMapping("/updatefood/{Serial_no}")
    public ResponseEntity<String> updatefood(
            @PathVariable Integer Serial_no,
            @RequestParam(required = false) String food_id,
            @RequestParam(required = false) String food_name,
            @RequestParam(required = false) String foodcode,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @RequestParam(required = false) String update_by,
            @RequestParam(required = false) String created_by,
            @RequestParam(required = false) String gst_no,
            @RequestParam(required = false) String price,
            @RequestParam(required = false) String image) throws IOException {

        Optional<Food> optionalFood = foodRepo.findById(Serial_no);
        if (!optionalFood.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Food food = optionalFood.get();
        // Update fields if provided in the request
        if(food_id != null){
            food.setFood_id(Integer.valueOf(food_id));
        }
        if (food_name != null) {
            food.setFood_name(food_name);
        }
        if (foodcode != null) {
            food.setFoodcode(foodcode);
        }
        if (description != null) {
            food.setDescription(description);
        }
        if (category != null) {
            food.setCategory(category);
        }
        if (subcategory != null) {
            food.setSubcategory(subcategory);
        }
        if (update_by != null) {
            food.setUpdate_by(update_by);
        }
        if (created_by != null) {
            food.setCreated_by(created_by);
        }
        if (gst_no != null) {
            food.setGst_no(gst_no);
        }
        if (price != null) {
            food.setPrice(Integer.valueOf(price));
        }

        if (image != null) {
//            food.setImage("https://drive.google.com/uc?export=view&id="+image);
            food.setImage(image);
        }
        foodRepo.save(food);
        return ResponseEntity.ok("Food updated successfully!");
    }

    @Override
    public ResponseEntity<byte[]> generateExcelByStoreId(String store_id ) { // Accept storeId as a parameter
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Food Data");
            Row headerRow = sheet.createRow(0);
            String[] headerss = { "Food Name", "Description", "Food Code", "Category", "Subcategory", "Update By",
                    "GST No", "Created By", "Store ID", "Price" };
            for (int i = 0; i < headerss.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headerss[i]);
            }
            List<Food> foodList = foodRepo.findByStoreId(store_id ); // Assuming you have a method to fetch food data by
            // storeId
            int rowNum = 1;
            for (Food food : foodList) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(food.getFood_name());
                row.createCell(1).setCellValue(food.getDescription());
                row.createCell(2).setCellValue(food.getFoodcode());
                row.createCell(3).setCellValue(food.getCategory());
                row.createCell(4).setCellValue(food.getSubcategory());
                row.createCell(5).setCellValue(food.getUpdate_by());
                row.createCell(6).setCellValue(food.getGst_no());
                row.createCell(7).setCellValue(food.getCreated_by());
                row.createCell(8).setCellValue(food.getStore_id());
                row.createCell(9).setCellValue(food.getPrice());
            }
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "food_datas.xlsx");
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(outputStream.toByteArray());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Override
    public ResponseEntity<String> uploadFoodList(@RequestParam("store_id") String storeId,
                                                 @RequestParam("file") MultipartFile file) {
        try {
            List<Food> foodList = foodService.processExcelFile(storeId, file);
            return new ResponseEntity<>("Food list uploaded successfully for store ID: " + storeId, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
            return new ResponseEntity<>("Failed to upload food list: " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}

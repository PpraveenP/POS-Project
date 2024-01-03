package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Food;
import com.SYNTIARO_POS_SYSTEM.Repository.FoodRepo;
import com.SYNTIARO_POS_SYSTEM.Service.FoodService;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.util.*;


@Service
public class FoodServiceIMPL implements FoodService {

	@Autowired
	private FoodRepo foodRepo;

	//THIS METHOD IS USE FOR POST FOOD
	@Override
	public String addFood(Food food) {
		foodRepo.save(food);
		return food.getFood_names();
	}

	//THIS METHOD IS USE FOR GET ALL LIST OF FOOD
	@Override
	public List<Food> getFood() {
		// TODO Auto-generated method stub
		return foodRepo.findAll();
	}

	//THIS METHOD IS USE FOR UPDATE FOOD
	@Override
	public Food updateFood(Food food) {
		foodRepo.save(food);
		return food;
	}

	//THIS METHOD IS USE FOR DELETE FOOD
	@Override
	public void deletefood(int parseInt) {
		Food entity = foodRepo.getOne(parseInt);
		foodRepo.delete(entity);
	}
	//THIS METHOD IS USE FOR NOT INSERT SAME FOOD NAME
	@Override
	public Food saveFood(Food food) {
		String foodName = food.getFood_name();
		String storeId = food.getStore_id();
		// Check if the food name already exists in the store
		boolean foodExistsInStore = foodRepo.existsByFoodNameAndStoreId(foodName, storeId);
		if (foodExistsInStore) {
			return null;
		}
		return foodRepo.save(food);
	}


	// THIS METHOD IS USE FOR FETCH FOOD BY ID
	@Override
	public Optional<Food> getfoodbyid(Integer food_id) {
		return foodRepo.findById(food_id);
	}


	// THIS METHOD IS USE FOR UPDATE FOOD
	@Override
	public Food updateFood(Integer food_id, Food food) {
		Optional<Food> existingFood = foodRepo.findById((int) Integer.parseInt(String.valueOf((food_id))));
		if (existingFood.isPresent()) {
			Food updatefood = existingFood.get();
			if (food.getFood_name() != null) {
				updatefood.setFood_name(food.getFood_name());
			}
			if (food.getDescription() != null) {
				updatefood.setDescription(food.getDescription());
			}
			if (food.getCategory() != null) {
				updatefood.setCategory(food.getCategory());
			}
			if (food.getSubcategory() != null) {
				updatefood.setSubcategory(food.getSubcategory());
			}
			if (food.getUpdate_by() != null) {
				updatefood.setUpdate_by(food.getUpdate_by());
			}
			if (food.getGst_no() != null) {
				updatefood.setGst_no(food.getGst_no());
			}
			if (food.getCreated_by() != null) {
				updatefood.setCreated_by(food.getCreated_by());
			}
			if (food.getStore_id() != null) {
				updatefood.setStore_id(food.getStore_id());
			}
			if (food.getPrice() != null) {
				updatefood.setPrice(food.getPrice());
			}
			if (food.getFoodcode() != null) {
				updatefood.setFoodcode(food.getFoodcode());
			}
			foodRepo.save(updatefood);
			return updatefood;
		} else {
			return null;
		}
	}


	// THIS METHOD IS USE FOR FETCH FOOD BY STOREID
	@Override
	public List<Food> fetchFoodsByStoreId(String storeId) {
		return foodRepo.findByStore_id(storeId);
	}

	@Override
	public List<Food> processExcelFile(String storeId, MultipartFile file) throws IOException {
		List<Food> foodList = new ArrayList<>();

		Workbook workbook = WorkbookFactory.create(file.getInputStream());
		Sheet sheet = workbook.getSheetAt(0);
		Iterator<Row> rowIterator = sheet.iterator();
		rowIterator.next(); // Skip the header row if present
		while (rowIterator.hasNext()) {
			Row row = rowIterator.next();
			Food food = new Food();
			food.setStore_id(storeId);
			food.setFood_name(row.getCell(0).getStringCellValue());
			food.setFood_id((int) row.getCell(1).getNumericCellValue());
			food.setCategory(row.getCell(2).getStringCellValue());
			food.setDescription( row.getCell(3).getStringCellValue());
			food.setSubcategory( row.getCell(4).getStringCellValue());
			food.setPrice((int) row.getCell(5).getNumericCellValue());
			food.setFoodcode( row.getCell(6).getStringCellValue());
			foodRepo.save(food);
			foodList.add(food);
		}
		workbook.close();
		return foodList;
	}


}	
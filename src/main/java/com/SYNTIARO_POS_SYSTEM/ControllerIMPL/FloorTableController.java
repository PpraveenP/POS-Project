package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.FloorTable;
import com.SYNTIARO_POS_SYSTEM.Entity.FoodItem;
import com.SYNTIARO_POS_SYSTEM.Entity.Vendor;
import com.SYNTIARO_POS_SYSTEM.Repository.FloorTableRepo;
import com.SYNTIARO_POS_SYSTEM.Repository.TableRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/sys/floortable")
public class FloorTableController {

    @Autowired
   private FloorTableRepo floorTableRepo;

    @Autowired
    private TableRepo tableRepo;

    @PostMapping("/addfloortable")
    public ResponseEntity<?> addFloorTable(@RequestBody FloorTable floorTable) {
        if (floorTableRepo.existsBystoreidAndFloorname(floorTable.getStoreid(), floorTable.getFloorname())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: FloorName '" + floorTable.getFloorname() + "' is already taken for the given storeId.");
        }
        FloorTable savedFloorTable = floorTableRepo.save(floorTable);
        return ResponseEntity.ok(savedFloorTable);
    }


//    @PostMapping("/tables")
//    public ResponseEntity<String> createTables(@RequestBody List<FloorTable> floorTables) {
//        System.out.println("Received Table Information: " + floorTables);
//        floorTableRepo.saveAll(floorTables);
//        return new ResponseEntity<>("Tables.java created successfully", HttpStatus.CREATED);
//    }


    @PatchMapping("/updatetables/{serial_no}")
    public ResponseEntity<FloorTable> updateFloorTable(@PathVariable("serial_no") Long serialNo, @RequestBody FloorTable floorTable) {
        Optional<FloorTable> existingFloorTable = floorTableRepo.findById(serialNo);

        if (existingFloorTable.isPresent()) {
            FloorTable updateFloorTable = existingFloorTable.get();

            if (floorTable.getFloorname() != null) {
                updateFloorTable.setFloorname(floorTable.getFloorname());
            }


            floorTableRepo.save(floorTable);
            return new ResponseEntity<>(updateFloorTable, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/getTable/{serial_no}")
    public Optional<FloorTable>gettablebyserial_no(@PathVariable Long serial_no){
       return floorTableRepo.findById(serial_no);
    }

    @GetMapping("/getTablebystoreid/{storeid}")
    public List<FloorTable>gettablebystoreid(@PathVariable Long storeid){
        return floorTableRepo.findbyStoreid(storeid);
    }

    @DeleteMapping("/deleteTable/{serial_no}")
    public ResponseEntity<String> deleteTableById(@PathVariable long serial_no) {
        try {
            // Delete the table by serial_no
            floorTableRepo.deleteById(serial_no);

            return ResponseEntity.ok("Table deleted successfully");
        } catch (Exception e) {
            // Handle exceptions or not found scenario
            return ResponseEntity.status(404).body("Table not found");
        }
    }



    @PostMapping("/addfloor")
    public ResponseEntity<?> createFloortable(@RequestBody FloorTable floorTable) {
        // Check if the food name is available in the specified store ID
        if (floorTableRepo.existsBystoreidAndFloorname(floorTable.getStoreid(), floorTable.getFloorname())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: FloorName '" + floorTable.getFloorname() + "' is already taken for the given storeId.");
        }
        FloorTable createdFoodItem = floorTableRepo.save(floorTable);
        return new ResponseEntity<>(createdFoodItem, HttpStatus.CREATED);
    }
}

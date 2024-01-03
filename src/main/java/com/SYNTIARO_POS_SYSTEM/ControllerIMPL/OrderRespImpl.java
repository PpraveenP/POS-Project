package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Orders;
import com.SYNTIARO_POS_SYSTEM.Repository.FoodRepo;
import com.SYNTIARO_POS_SYSTEM.Repository.OrderRepo;
import com.SYNTIARO_POS_SYSTEM.Request.OrderRequest;
import com.SYNTIARO_POS_SYSTEM.Response.OrderResponse;
import com.SYNTIARO_POS_SYSTEM.Service.FoodService;
import com.SYNTIARO_POS_SYSTEM.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RequestMapping(path = "/sys/order")
@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderRespImpl {

    @Autowired
    OrderService orderService;
    @Autowired
    FoodService foodService;
    @Autowired
    private OrderRepo orderRepo;
    @Autowired
    FoodRepo foodRepository;

    // THIS METHOS IS USE FOR POST ORDER
    @PostMapping(path = "/postorder")
    public Orders placeOrder(@RequestBody OrderRequest request) {
        return orderRepo.save(request.getOrder());
    }

    // THIS METHOD IS USE FOR UPDATE ORDER
    @PutMapping(path = "/updateorder")
    public Orders updateOrder(@RequestBody Orders order) {
        return this.orderService.updateOrder(order);
    }

    // THIS METHOD IS USE FOR DELETE ORDER
    @DeleteMapping(path = "/orders/{oid}")
    public ResponseEntity<HttpStatus> deleteorder(@PathVariable String oid) {
        try {
            this.orderService.deleteorder(Integer.parseInt(oid));
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // THIS METHOD IS USE FOR GET ALL LIST OF ORDER
    @GetMapping(path = "/getorder")
    public List<Orders> getorder() {
        return this.orderService.getorder();
    }

    // THIS METHOD IS USE FOR GET ORDER BY ID
    @GetMapping(path = "/order/{orderid}")
    public Optional<Orders> getorderbyid(@PathVariable Integer orderid) {
        return this.orderService.getorderbyid(orderid);
    }

    // THIS METHOD IS USE FOR GET ORDER BY STOREID
    @GetMapping("/bystore/{storeId}")
    public List<Orders> getOrdersByStoreId(@PathVariable("storeId") String storeId) {
        return orderService.getOrdersByStoreId(storeId);
    }

    // THIS METHOD IS USE FOR POST ORDER
    @PostMapping(path = "/postorders")
    public int addOrder(@RequestBody Orders order) {
        int id = orderService.addOrder(order);
        return id;
    }

    // THIS METHOD IS USE FOR GET ORDER BY ID
    @GetMapping(path = "/getOrderByID/{oid}")
    public ResponseEntity<Orders> fetchorderbyid(@PathVariable Integer oid) {
        Optional<Orders> orderOptional = this.orderService.getorderbyid(oid);
        if (orderOptional.isPresent()) {
            Orders order = orderOptional.get();
            return ResponseEntity.ok(order);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // THIS METHOD IS USE FOR UPDATE ORDER
    @PatchMapping(path = "/updateorder/{orderid}")
    public ResponseEntity<?> updateOrderPartial(@PathVariable String orderid, @RequestBody OrderRequest request) {
        Optional<Orders> orderOptional = orderRepo.findById(Integer.parseInt(orderid));
        if (orderOptional.isPresent()) {
            Orders existingOrder = orderOptional.get();
            Orders updatedOrder = request.getOrder();

            // Patch the order properties
            if (updatedOrder.getOrddate() != null) {
                existingOrder.setOrddate(updatedOrder.getOrddate());
            }
            if (updatedOrder.getTblno() != null) {
                existingOrder.setTblno(updatedOrder.getTblno());
            }
            if (updatedOrder.getOrdstatus() != null) {
                existingOrder.setOrdstatus(updatedOrder.getOrdstatus());
            }
            if (updatedOrder.getOrdertype() != null) {
                existingOrder.setOrdertype(updatedOrder.getOrdertype());
            }
            if (updatedOrder.getCrtdate() != null) {
                existingOrder.setCrtdate(updatedOrder.getCrtdate());
            }
            if (updatedOrder.getUpddate() != null) {
                existingOrder.setUpddate(updatedOrder.getUpddate());
            }
            if (updatedOrder.getCrtby() != null) {
                existingOrder.setCrtby(updatedOrder.getCrtby());
            }
            if (updatedOrder.getUpdby() != null) {
                existingOrder.setUpdby(updatedOrder.getUpdby());
            }
            if (updatedOrder.getSid() != null) {
                existingOrder.setSid(updatedOrder.getSid());
            }
            // Add more properties to patch as needed
            orderRepo.save(existingOrder);
            return ResponseEntity.ok("Order updated successfully!");
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PatchMapping(path = "/updateorderStatus/{Serial_no}")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Integer Serial_no) {
        Optional<Orders> orderOptional = orderRepo.findbySerialno(Serial_no);

        if (orderOptional.isPresent()) {
            Orders existingOrder = orderOptional.get();
            existingOrder.setOrdstatus("Prepared");
            // Add more properties to patch as needed
            orderRepo.save(existingOrder);
            return ResponseEntity.ok("Order Status updated successfully!");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping(path = "/updateorderStatusto/{Serial_no}")
    public ResponseEntity<?> updateOrderStatus2(@PathVariable Integer Serial_no) {
        Optional<Orders> orderOptional = orderRepo.findbySerialno(Serial_no);

        if (orderOptional.isPresent()) {
            Orders existingOrder = orderOptional.get();
            existingOrder.setOrdstatus("completed");
            // Add more properties to patch as needed
            orderRepo.save(existingOrder);
            return ResponseEntity.ok("Order Status updated successfully!");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

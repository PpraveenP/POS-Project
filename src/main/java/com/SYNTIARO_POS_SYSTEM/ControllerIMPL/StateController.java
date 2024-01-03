package com.SYNTIARO_POS_SYSTEM.ControllerIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.State;
import com.SYNTIARO_POS_SYSTEM.Repository.StateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/sys/api/states")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StateController {
    private final StateRepository stateRepository;

    @Autowired
    public StateController(StateRepository stateRepository) {
        this.stateRepository = stateRepository;
    }

    @GetMapping("/getallstates")
    public List<State> getAllStates() {
        return stateRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<State> getStateById(@PathVariable Long id) {
        Optional<State> state = stateRepository.findById(id);
        return state.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<State> createState(@RequestBody State state) {
        State createdState = stateRepository.save(state);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdState);
    }

}

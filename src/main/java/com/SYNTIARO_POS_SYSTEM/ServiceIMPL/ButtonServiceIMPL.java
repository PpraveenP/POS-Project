package com.SYNTIARO_POS_SYSTEM.ServiceIMPL;

import com.SYNTIARO_POS_SYSTEM.Entity.Button;
import com.SYNTIARO_POS_SYSTEM.Repository.ButtonRepo;
import com.SYNTIARO_POS_SYSTEM.Service.ButtonService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
public class ButtonServiceIMPL implements ButtonService {

    @Autowired
    ButtonRepo buttonRepo;
    @Override
    public Button updateButton(Long id, Button button) {
        Optional<Button> existingButton = buttonRepo.findById((long) Integer.parseInt(String.valueOf(id)));
        if (existingButton.isPresent()) {
            Button updatedButton = existingButton.get();
            // Update the properties of the updatedInventory
            if (button.getButName() != null) {
                updatedButton.setButName(button.getButName());
            }

            buttonRepo.save(updatedButton);
            return updatedButton;
        } else {
            return null;
        }
    }


}

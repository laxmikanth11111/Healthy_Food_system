package com.healthybite.app.controller;

import com.healthybite.app.model.ContactMessage;
import com.healthybite.app.repository.ContactMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactMessageRepository contactMessageRepository;

    @PostMapping
    public ResponseEntity<?> submitMessage(@RequestBody ContactMessage message) {
        if (message.getName() == null || message.getEmail() == null || message.getMessage() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Name, email and message are required"));
        }
        ContactMessage saved = contactMessageRepository.save(message);
        return ResponseEntity.ok(Map.of("message", "Thanks for reaching out! We'll get back to you soon.", "id", saved.getId()));
    }
}

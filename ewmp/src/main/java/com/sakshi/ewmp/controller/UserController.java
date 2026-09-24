package com.sakshi.ewmp.controller;

import com.sakshi.ewmp.entity.User;
import com.sakshi.ewmp.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/{id}/reset-password")
public User resetPassword(@PathVariable Long id, @RequestBody User updatedUser) {
    return userService.updateUser(id, updatedUser);
}
}
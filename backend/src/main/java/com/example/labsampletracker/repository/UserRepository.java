package com.example.labsampletracker.repository;

import com.example.labsampletracker.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);

}


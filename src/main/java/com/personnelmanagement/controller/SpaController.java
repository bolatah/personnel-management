package com.personnelmanagement.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = {"/{path:[^\\.]*}", "/{path:^(?!api$).*$}/**"})
@CrossOrigin(origins = "*")
@Controller
public class SpaController {
    public String forward() {
        return "forward:/index.html";
    }
}

package com.cfs.tinytrail.controller;

import com.cfs.tinytrail.dto.UrlMappingDto;
import com.cfs.tinytrail.dto.clickEventDto;
import com.cfs.tinytrail.entity.User;
import com.cfs.tinytrail.service.UrlMappingService;
import com.cfs.tinytrail.service.UserService;
import lombok.AllArgsConstructor;
import org.springframework.cglib.core.Local;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/urls")
@AllArgsConstructor
@PreAuthorize("hasRole('USER')")
public class UrlMappingController {

    private UrlMappingService urlMappingService;
    private UserService userService;

    @PostMapping("/shorten")
    public ResponseEntity<UrlMappingDto> shortenUrl(@RequestBody Map<String , String> Request, Principal principal){
        String originalUrl = Request.get("originalUrl");
       User user =  userService.findByUsername(principal.getName());
       UrlMappingDto urlMappingDto = urlMappingService.createShortUr(originalUrl , user);
       return ResponseEntity.ok(urlMappingDto);

    }

    @GetMapping("/myurls")
    public ResponseEntity<List<UrlMappingDto>> getMyurls(Principal principal){
            User user = userService.findByUsername(principal.getName());
            List<UrlMappingDto> urlsList = urlMappingService.getUrlsByUsername(user);
            return ResponseEntity.ok(urlsList);
    }

    @GetMapping("/analytics/{shortUrl}")
    public ResponseEntity<List< clickEventDto>> getUrlAnalytics (@PathVariable  String shortUrl, @RequestParam("startDate") String startDate,
                                                                 @RequestParam("endDate") String endDate){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE_TIME;
        LocalDateTime StartDate = LocalDateTime.parse(startDate, formatter);
        LocalDateTime EndDate = LocalDateTime.parse(endDate, formatter);
        List<clickEventDto> response = urlMappingService.getClickEventsByDate(shortUrl ,StartDate , EndDate);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/totalclicks")
    public ResponseEntity<Map<LocalDate , Long>> getTotalClicksByDate(Principal principal,
                                                                      @RequestParam("startDate") String startDate,
                                                                      @RequestParam("endDate") String endDate
    ){
        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        LocalDate StartDate = LocalDate.parse(startDate, formatter);
        LocalDate EndDate = LocalDate.parse(endDate, formatter);
        User user =  userService.findByUsername(principal.getName());
        Map<LocalDate , Long> response= urlMappingService.getTotalClicks(user , StartDate , EndDate);
        return ResponseEntity.ok(response);

    }


}
